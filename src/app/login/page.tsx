"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useAuth } from "@/lib/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  KeyRound,
  Smartphone,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const intl = useIntl();
  const router = useRouter();
  const { isLoggedIn, mounted, login } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // OTP Verification state
  const [otpCode, setOtpCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [showCodeInput, setShowCodeInput] = useState(false);

  // If already authenticated, redirect directly to dashboard
  useEffect(() => {
    if (mounted && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [mounted, isLoggedIn, router]);

  // Handle URL errors (e.g. invalid or expired auth magic link)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "auth_failed") {
        const details = params.get("details");
        setErrorMsg(
          details
            ? `${intl.formatMessage({ id: "login.authFailed" })} (${details})`
            : intl.formatMessage({ id: "login.authFailed" })
        );
      }
    }
  }, [intl]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const sendOtpRequest = useCallback(
    async (targetEmail: string) => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isConfigured =
        Boolean(supabaseUrl) &&
        !supabaseUrl?.includes("placeholder-project") &&
        !supabaseUrl?.includes("your-project-id");

      if (isConfigured) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOtp({
          email: targetEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });
        if (error) {
          throw error;
        }
      } else {
        // Fallback simulation for local dev prior to entering Supabase keys
        await new Promise((r) => setTimeout(r, 600));
      }
    },
    []
  );

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("pingme-user-email", targetEmail);
    }

    setLoading(true);
    setErrorMsg(null);
    setOtpError(null);

    try {
      await sendOtpRequest(targetEmail);
      setSent(true);
      setCooldown(30);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : intl.formatMessage({ id: "login.magicLinkError" });
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || loading) return;
    const targetEmail = email.trim().toLowerCase();
    if (!targetEmail) return;

    setLoading(true);
    setOtpError(null);

    try {
      await sendOtpRequest(targetEmail);
      setCooldown(30);
      setOtpCode("");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : intl.formatMessage({ id: "login.magicLinkError" });
      setOtpError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = otpCode.replace(/\D/g, "");
    if (!cleanCode || cleanCode.length < 6) return;

    const targetEmail = email.trim().toLowerCase();
    setVerifying(true);
    setOtpError(null);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isConfigured =
        Boolean(supabaseUrl) &&
        !supabaseUrl?.includes("placeholder-project") &&
        !supabaseUrl?.includes("your-project-id");

      if (isConfigured) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.verifyOtp({
          email: targetEmail,
          token: cleanCode,
          type: "email",
        });

        if (error || !data.session) {
          throw new Error(
            error?.message || intl.formatMessage({ id: "login.otpError" })
          );
        }
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("pingme-user-email", targetEmail);
      }
      login("/dashboard");
    } catch (err: unknown) {
      console.warn("OTP verification error:", err);
      setOtpError(intl.formatMessage({ id: "login.otpError" }));
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-50 dark:bg-[#0B0F19] transition-colors relative">
      <div className="absolute top-6 right-6">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <BrandLogo size="lg" />
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-4">
            <FormattedMessage id="login.title" />
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <FormattedMessage id="login.subtitle" />
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
          {sent ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  <FormattedMessage id="login.otpTitle" />
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <FormattedMessage
                    id="login.otpDesc"
                    values={{
                      email: (
                        <strong className="font-bold text-slate-900 dark:text-white">
                          {email.trim()}
                        </strong>
                      ),
                    }}
                  />
                </p>
              </div>

              {otpError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* 6-8 Digit Code Form */}
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">
                    <FormattedMessage id="login.otpLabel" />
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={10}
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setOtpCode(val);
                      if (val.length >= 6) {
                        setOtpError(null);
                      }
                    }}
                    placeholder="12345678"
                    className="w-full text-center font-mono font-extrabold text-xl sm:text-2xl tracking-[0.25em] rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  disabled={verifying || otpCode.length < 6}
                  className="w-full shadow-md shadow-emerald-600/20"
                >
                  {verifying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>
                        <FormattedMessage id="login.verifyingCode" />
                      </span>
                    </>
                  ) : (
                    <>
                      <FormattedMessage id="login.otpBtn" />
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Alternative: Direct Magic Link in email */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 text-center">
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <FormattedMessage id="login.orMagicLink" />
                </p>
                <p className="text-[11px] text-slate-400">
                  <FormattedMessage id="login.sameDeviceTip" />
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setOtpError(null);
                    setOtpCode("");
                  }}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  <FormattedMessage id="login.tryAnother" />
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={handleResend}
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                >
                  {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                  {cooldown > 0 ? (
                    <FormattedMessage
                      id="login.resendCooldown"
                      values={{ seconds: cooldown }}
                    />
                  ) : (
                    <FormattedMessage id="login.resendBtn" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              {errorMsg && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <FormattedMessage id="login.emailLabel" />
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    disabled={loading}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={intl.formatMessage({ id: "login.emailPlaceholder" })}
                    required
                    className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <Button type="submit" size="md" disabled={loading} className="w-full shadow-md shadow-emerald-600/20">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span><FormattedMessage id="login.sendingMagicLink" /></span>
                  </>
                ) : (
                  <>
                    <FormattedMessage id="login.magicBtn" />
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <FormattedMessage id="common.backToHome" />
          </Link>
        </p>
      </div>
    </div>
  );
}
