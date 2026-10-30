"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { SuccessState } from "@/components/ui/SuccessState";
import { useAuth } from "@/lib/useAuth";
import { createClient } from "@/lib/supabase/client";
import { Mail, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const intl = useIntl();
  const router = useRouter();
  const { isLoggedIn, mounted } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        setErrorMsg(intl.formatMessage({ id: "login.authFailed" }));
      }
    }
  }, [intl]);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = email.trim();
    if (!targetEmail) return;

    setLoading(true);
    setErrorMsg(null);

    try {
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

      setSent(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : intl.formatMessage({ id: "login.magicLinkError" });
      setErrorMsg(message);
    } finally {
      setLoading(false);
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
            <SuccessState
              size="sm"
              title={<FormattedMessage id="login.sentTitle" />}
              description={<FormattedMessage id="login.sentDesc" values={{ email: email.trim() }} />}
              actionButton={
                <Button variant="outline" size="sm" onClick={() => setSent(false)}>
                  <FormattedMessage id="login.tryAnother" />
                </Button>
              }
            />
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
