"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useAuth } from "@/lib/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  ShieldCheck,
  Lock,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Smartphone,
  Mail,
  Car,
  CreditCard,
  Building2,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";

type ChannelType = "whatsapp" | "sms" | "email";

export default function OrderPage() {
  const intl = useIntl();
  const router = useRouter();
  const { login } = useAuth();

  // Stepper state: 1 = Vehicle/Alerts, 2 = Shipping & Payment, 3 = Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State - Step 1: Vehicle & Alerts
  const [plate, setPlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [rdwLoading, setRdwLoading] = useState(false);
  const [rdwVerified, setRdwVerified] = useState(false);
  const [rdwChecked, setRdwChecked] = useState(false);
  const [channel, setChannel] = useState<ChannelType>("whatsapp");
  const [phone, setPhone] = useState("+31 6 ");
  const [email, setEmail] = useState("");

  // Form State - Step 2: Shipping
  const [fullName, setFullName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [addition, setAddition] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressFound, setAddressFound] = useState(false);

  // Field blur / touched tracking for inline errors
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const markTouched = (field: string) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  // Payment Execution & Verification State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Form State - Step 3: Success Results
  const [orderId, setOrderId] = useState("");
  const [stickerToken, setStickerToken] = useState("");
  const [resendingMagicLink, setResendingMagicLink] = useState(false);
  const [magicLinkResent, setMagicLinkResent] = useState(false);

  const handleResendMagicLink = async () => {
    if (!email) return;
    setResendingMagicLink(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
        const supabase = createClient();
        await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          },
        });
      }
      setMagicLinkResent(true);
      setTimeout(() => setMagicLinkResent(false), 5000);
    } catch (err) {
      console.error("Resend magic link error:", err);
    } finally {
      setResendingMagicLink(false);
    }
  };

  // Check for Stripe Checkout return (?session_id=... or ?payment=cancelled)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const paymentStatus = params.get("payment");

    if (paymentStatus === "cancelled") {
      setPaymentError(
        intl.locale === "nl"
          ? "De betaling is geannuleerd. Je kunt hieronder direct opnieuw klikken om af te rekenen."
          : "Payment was cancelled. You can click below to try again."
      );
      setStep(2);
      return;
    }

    if (sessionId) {
      setIsVerifyingSession(true);
      fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.paid && data.order) {
            setOrderId(data.order.orderId);
            setStickerToken(data.order.token);
            setPlate(data.order.plate);
            setMake(data.order.make);
            setModel(data.order.model);
            setColor(data.order.color);
            setChannel(data.order.channel || "whatsapp");
            setEmail(data.order.email);
            setPhone(data.order.phone);
            setFullName(data.order.fullName);
            setStreet(data.order.street);
            setHouseNumber(data.order.houseNumber);
            setPostalCode(data.order.postalCode);
            setCity(data.order.city);

            localStorage.setItem("pingme-user-vehicle", JSON.stringify(data.order));
            // Do NOT log in directly; clear session flags so user must use the magic link sent to their email
            localStorage.removeItem("pingme-has-session");
            localStorage.removeItem("pingme-auth");

            // Client-side OTP fallback if server did not send it
            if (!data.magicLinkSent && data.order?.email) {
              const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
              if (supabaseUrl && !supabaseUrl.includes("placeholder")) {
                try {
                  const supabase = createClient();
                  supabase.auth.signInWithOtp({
                    email: data.order.email,
                    options: {
                      emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                    },
                  });
                } catch (otpErr) {
                  console.log("Client fallback OTP notice:", otpErr);
                }
              }
            }

            setStep(3);
          } else {
            setPaymentError(data.error || intl.formatMessage({ id: "order.verifyFailed" }));
          }
        })
        .catch((err) => {
          console.error("Verification error:", err);
          setPaymentError(intl.formatMessage({ id: "order.verifyError" }));
        })
        .finally(() => {
          setIsVerifyingSession(false);
        });
    }
  }, [login, intl.locale]);

  // Debounced RDW plate lookup
  useEffect(() => {
    const cleaned = plate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (cleaned.length < 6) {
      setRdwVerified(false);
      setRdwChecked(false);
      return;
    }

    const timer = setTimeout(async () => {
      setRdwLoading(true);
      try {
        const res = await fetch(`/api/rdw?plate=${encodeURIComponent(cleaned)}`);
        const data = await res.json();
        if (data.found) {
          setMake(data.make || "");
          setModel(data.model || "");
          setColor(data.color || "");
          setRdwVerified(true);
        } else {
          setRdwVerified(false);
        }
      } catch {
        setRdwVerified(false);
      } finally {
        setRdwLoading(false);
        setRdwChecked(true);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [plate]);

  // Debounced Dutch Postcode + House Number lookup (Kadaster / PDOK BAG registry)
  useEffect(() => {
    const cleanedPostcode = postalCode.replace(/\s+/g, "").toUpperCase();
    const cleanedNumber = houseNumber.trim();

    // Dutch postcode pattern: 4 digits + 2 letters (e.g. 1014AD)
    const isValidPostcode = /^[1-9][0-9]{3}[A-Z]{2}$/.test(cleanedPostcode);
    const hasHouseNumber = cleanedNumber.length > 0 && /\d/.test(cleanedNumber);

    if (!isValidPostcode || !hasHouseNumber) {
      setAddressFound(false);
      return;
    }

    const timer = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const res = await fetch(
          `/api/address?postalCode=${encodeURIComponent(cleanedPostcode)}&houseNumber=${encodeURIComponent(cleanedNumber)}`
        );
        const data = await res.json();
        if (data.found) {
          setStreet(data.street || "");
          setCity(data.city || "");
          setAddressFound(true);
        } else {
          setAddressFound(false);
        }
      } catch {
        setAddressFound(false);
      } finally {
        setAddressLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [postalCode, houseNumber]);

  // Step 1 Validation
  const isValidPlate = plate.trim().replace(/[^a-zA-Z0-9]/g, "").length >= 6;
  const phoneDigits = phone.replace(/\D/g, "");
  const isValidPhone =
    channel === "email"
      ? phone.trim() === "" || (phoneDigits.length >= 9 && phoneDigits.length <= 15 && !/[a-zA-Z]/.test(phone))
      : phoneDigits.length >= 9 && phoneDigits.length <= 15 && !/[a-zA-Z]/.test(phone);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const canContinueStep1 = isValidPlate && isValidEmail && isValidPhone;

  const handleContinueStep1 = () => {
    if (!canContinueStep1) {
      setTouched((prev) => ({
        ...prev,
        plate: true,
        phone: true,
        email: true,
      }));
      return;
    }
    setStep(2);
  };

  // Step 2 Validation
  const isValidFullName = fullName.trim().length >= 2;
  const isValidPostalCode = postalCode.trim().length >= 5;
  const isValidHouseNumber = houseNumber.trim().length > 0;
  const isValidStreet = street.trim().length > 0;
  const isValidCity = city.trim().length > 0;

  const canContinueStep2 =
    isValidFullName &&
    isValidPostalCode &&
    isValidHouseNumber &&
    isValidStreet &&
    isValidCity;

  // Handle Payment Execution via Stripe Checkout
  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinueStep2) {
      setTouched((prev) => ({
        ...prev,
        fullName: true,
        postalCode: true,
        houseNumber: true,
        street: true,
        city: true,
      }));
      return;
    }

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plate: plate.toUpperCase(),
          make,
          model,
          color,
          channel,
          phone,
          email: email.trim(),
          fullName,
          postalCode,
          houseNumber,
          addition,
          street,
          city,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        setPaymentError(data.error || intl.formatMessage({ id: "order.initiateFailed" }));
        setIsProcessingPayment(false);
        return;
      }

      // Redirect to real Stripe Checkout Session
      window.location.href = data.url;
    } catch (err: any) {
      console.error("Payment error:", err);
      setPaymentError(err.message || intl.formatMessage({ id: "order.initiateFailed" }));
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Checkout Minimal Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-[#0B1117]/90 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center">
            <BrandLogo size="md" />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
              <Lock className="w-3.5 h-3.5" />
              <FormattedMessage id="order.secureCheckout" />
            </div>

            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Verification Loader when returning from Stripe Checkout */}
        {isVerifyingSession ? (
          <div className="max-w-md mx-auto py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              <FormattedMessage id="order.processingPayment" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <FormattedMessage id="order.verifyingPaymentDesc" />
            </p>
          </div>
        ) : (
          <>
            {paymentError && (
              <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-center justify-between">
                <span>{paymentError}</span>
                <button
                  type="button"
                  onClick={() => setPaymentError(null)}
                  className="font-bold underline text-xs ml-4 cursor-pointer"
                >
                  <FormattedMessage id="common.dismiss" />
                </button>
              </div>
            )}

            {/* Stepper Progress Bar (2 Simple Steps) */}
            {step < 3 && (
              <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
                <div className="grid grid-cols-2 gap-4 text-center">
                  {[
                    { s: 1, labelId: "order.step1" },
                    { s: 2, labelId: "order.step2" },
                  ].map(({ s, labelId }) => (
                    <div key={s} className="flex flex-col items-center">
                      <div
                        className={`h-2 sm:h-2.5 w-full rounded-full transition-all duration-300 ${
                          step >= s
                            ? "bg-emerald-500"
                            : "bg-slate-200 dark:bg-slate-800"
                        }`}
                      />
                      <span
                        className={`text-xs font-bold mt-2 transition-colors ${
                          step >= s
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        <FormattedMessage id={labelId} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

        {/* 2-Column Checkout Layout (Forms on Left, Sticky Summary on Right) */}
        {step < 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Active Step Form */}
            <div className="lg:col-span-7 space-y-6">
              {/* STEP 1: Vehicle & Alerts */}
              {step === 1 && (
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                      <FormattedMessage id="order.vehicleTitle" />
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <FormattedMessage id="order.vehicleSubtitle" />
                    </p>
                  </div>

                  {/* Dutch License Plate Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      <FormattedMessage id="order.plateLabel" />
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Styled Dutch Yellow Plate */}
                      <div
                        className={`inline-flex items-center rounded-xl bg-[#FFD700] border-2 shadow-md overflow-hidden font-mono font-black text-xl tracking-wider select-none text-black h-12 w-fit transition-all ${
                          touched.plate && !isValidPlate
                            ? "border-rose-500 ring-2 ring-rose-500/30"
                            : "border-black"
                        }`}
                      >
                        <div className="bg-[#003399] text-white px-2.5 h-full flex flex-col items-center justify-center text-[10px] leading-tight font-sans">
                          <span className="text-[9px]">★</span>
                          <span className="font-bold">NL</span>
                        </div>
                        <input
                          type="text"
                          value={plate}
                          onChange={(e) => setPlate(e.target.value.toUpperCase())}
                          onBlur={() => markTouched("plate")}
                          placeholder={intl.formatMessage({ id: "order.platePlaceholder" })}
                          className="bg-transparent text-black px-4 py-1.5 focus:outline-none uppercase font-mono tracking-widest text-lg w-52 placeholder-black/40 font-black"
                          maxLength={9}
                        />
                      </div>

                      {/* RDW status badge */}
                      {rdwLoading && (
                        <div className="inline-flex items-center gap-2 text-xs text-sky-600 dark:text-sky-400 font-medium">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <FormattedMessage id="order.rdwChecking" />
                        </div>
                      )}

                      {!rdwLoading && rdwVerified && (
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {make} {model} {color ? `(${color})` : ""}
                          </span>
                        </div>
                      )}
                    </div>
                    {touched.plate && !isValidPlate && (
                      <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 block font-medium">
                        <FormattedMessage id="order.plateError" />
                      </span>
                    )}
                  </div>

                  {/* Make, Model, Color (Auto-filled by RDW, or editable) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <FormattedMessage id="order.makeLabel" />
                      </label>
                      <input
                        type="text"
                        disabled={rdwLoading}
                        value={model ? `${make} ${model}` : make}
                        onChange={(e) => setMake(e.target.value)}
                        placeholder={intl.formatMessage({ id: "order.makePlaceholder" })}
                        className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-900/60 transition-opacity"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <FormattedMessage id="order.colorLabel" />
                      </label>
                      <input
                        type="text"
                        disabled={rdwLoading}
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder={intl.formatMessage({ id: "order.colorPlaceholder" })}
                        className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-900/60 transition-opacity"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Channel Selection */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                        <FormattedMessage id="order.channelTitle" />
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <FormattedMessage id="order.channelSubtitle" />
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* WhatsApp */}
                      <button
                        type="button"
                        onClick={() => setChannel("whatsapp")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          channel === "whatsapp"
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <MessageSquare className="w-5 h-5 text-emerald-600" />
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                            <FormattedMessage id="order.whatsappBadge" />
                          </span>
                        </div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          <FormattedMessage id="order.whatsappTitle" />
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          <FormattedMessage id="order.whatsappDesc" />
                        </div>
                      </button>

                      {/* SMS */}
                      <button
                        type="button"
                        onClick={() => setChannel("sms")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          channel === "sms"
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Smartphone className="w-5 h-5 text-sky-600" />
                        </div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          <FormattedMessage id="order.smsTitle" />
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          <FormattedMessage id="order.smsDesc" />
                        </div>
                      </button>

                      {/* Email */}
                      <button
                        type="button"
                        onClick={() => setChannel("email")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          channel === "email"
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Mail className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          <FormattedMessage id="order.emailTitle" />
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          <FormattedMessage id="order.emailDesc" />
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Owner Contact Information */}
                  <div className="space-y-4 pt-2">
                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                        <FormattedMessage id="order.contactTitle" />
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <FormattedMessage id="order.contactSubtitle" />
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.phoneLabel" />
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          onBlur={() => markTouched("phone")}
                          placeholder={intl.formatMessage({ id: "order.phonePlaceholder" })}
                          required
                          className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                            touched.phone && !isValidPhone
                              ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
                              : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                          }`}
                        />
                        {touched.phone && !isValidPhone ? (
                          <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 block font-medium">
                            <FormattedMessage id="order.phoneError" />
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            <FormattedMessage id="order.phoneHelper" />
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.emailLabel" />
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => markTouched("email")}
                          placeholder={intl.formatMessage({ id: "order.emailPlaceholder" })}
                          required
                          className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                            touched.email && !isValidEmail
                              ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
                              : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                          }`}
                        />
                        {touched.email && !isValidEmail ? (
                          <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 block font-medium">
                            <FormattedMessage id="order.emailError" />
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            <FormattedMessage id="order.emailHelper" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="pt-4">
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleContinueStep1}
                      className="w-full shadow-lg shadow-emerald-600/20"
                    >
                      <FormattedMessage id="order.btnContinueShipping" />
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: PostNL Shipping Address */}
              {step === 2 && (
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                      <FormattedMessage id="order.shippingTitle" />
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <FormattedMessage id="order.shippingSubtitle" />
                    </p>
                  </div>

                  {/* PostNL highlight banner */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
                    <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-xs text-amber-900 dark:text-amber-200">
                        <FormattedMessage id="order.postnlBadge" />
                      </div>
                      <div className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                        <FormattedMessage id="order.postnlDesc" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <FormattedMessage id="order.fullNameLabel" />
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onBlur={() => markTouched("fullName")}
                        placeholder={intl.formatMessage({ id: "order.fullNamePlaceholder" })}
                        required
                        className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                          touched.fullName && !isValidFullName
                            ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
                            : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                        }`}
                      />
                      {touched.fullName && !isValidFullName && (
                        <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 block font-medium">
                          <FormattedMessage id="order.fullNameError" />
                        </span>
                      )}
                    </div>

                    {/* Postal Code + House Number + Suffix */}
                    <div>
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-5 sm:col-span-5">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <FormattedMessage id="order.postalCodeLabel" />
                          </label>
                          <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                            onBlur={() => markTouched("postalCode")}
                            placeholder={intl.formatMessage({ id: "order.postalCodePlaceholder" })}
                            maxLength={7}
                            required
                            className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 uppercase font-mono tracking-wider transition-colors ${
                              touched.postalCode && !isValidPostalCode
                                ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
                                : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                            }`}
                          />
                          {touched.postalCode && !isValidPostalCode && (
                            <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 block font-medium">
                              <FormattedMessage id="order.postalCodeError" />
                            </span>
                          )}
                        </div>
                        <div className="col-span-4 sm:col-span-4">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <FormattedMessage id="order.houseNumberLabel" />
                          </label>
                          <input
                            type="text"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            onBlur={() => markTouched("houseNumber")}
                            placeholder={intl.formatMessage({ id: "order.houseNumberPlaceholder" })}
                            required
                            className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 font-mono transition-colors ${
                              touched.houseNumber && !isValidHouseNumber
                                ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
                                : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                            }`}
                          />
                          {touched.houseNumber && !isValidHouseNumber && (
                            <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 block font-medium">
                              <FormattedMessage id="order.houseNumberError" />
                            </span>
                          )}
                        </div>
                        <div className="col-span-3 sm:col-span-3">
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <FormattedMessage id="order.houseAdditionLabel" />
                          </label>
                          <input
                            type="text"
                            value={addition}
                            onChange={(e) => setAddition(e.target.value)}
                            placeholder={intl.formatMessage({ id: "order.houseAdditionPlaceholder" })}
                            className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Address lookup status hint */}
                      {addressLoading && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-600 dark:text-sky-400">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <FormattedMessage id="order.addressChecking" />
                        </div>
                      )}
                      {!addressLoading && addressFound && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <FormattedMessage id="order.addressFound" />
                        </div>
                      )}
                    </div>

                    {/* Street and City (Auto-filled or editable) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.streetLabel" />
                        </label>
                        <input
                          type="text"
                          disabled={addressLoading}
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          onBlur={() => markTouched("street")}
                          placeholder={intl.formatMessage({ id: "order.streetPlaceholder" })}
                          required
                          className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-900/60 transition-colors ${
                            touched.street && !isValidStreet
                              ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
                              : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                          }`}
                        />
                        {touched.street && !isValidStreet && (
                          <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 block font-medium">
                            <FormattedMessage id="order.streetError" />
                          </span>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.cityLabel" />
                        </label>
                        <input
                          type="text"
                          disabled={addressLoading}
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          onBlur={() => markTouched("city")}
                          placeholder={intl.formatMessage({ id: "order.cityPlaceholder" })}
                          required
                          className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-900/60 transition-colors ${
                            touched.city && !isValidCity
                              ? "border-rose-400 dark:border-rose-600 focus:ring-rose-500"
                              : "border-slate-300 dark:border-slate-700 focus:ring-emerald-500"
                          }`}
                        />
                        {touched.city && !isValidCity && (
                          <span className="text-[11px] text-rose-500 dark:text-rose-400 mt-1 block font-medium">
                            <FormattedMessage id="order.cityError" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Direct Stripe Checkout Trigger */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      type="button"
                      size="lg"
                      disabled={isProcessingPayment}
                      onClick={handleCompleteOrder}
                      className="w-full py-4 text-base font-bold shadow-xl shadow-emerald-600/20 bg-emerald-600 hover:bg-emerald-500 text-white transition-all rounded-2xl flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          <FormattedMessage id="order.processingPayment" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-1 text-emerald-200" />
                          <FormattedMessage id="order.btnProceedToPayment" />
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <FormattedMessage id="order.btnBack" />
                      </button>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span><FormattedMessage id="order.secureCheckout" /></span>
                      </div>
                    </div>

                    {/* Trust badges & accepted methods */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <span className="text-[11px]">
                        <FormattedMessage id="order.paymentMethodsAccepted" />
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0 font-bold text-[10px] text-slate-700 dark:text-slate-200">
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                          iDEAL
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                          Cards
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
                          Apple Pay
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary Card (Sticky) */}
            <div className="lg:col-span-5 sticky top-28 space-y-4">
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
                  <FormattedMessage id="order.summaryTitle" />
                </h3>

                {/* Items */}
                <div className="space-y-4 text-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        <FormattedMessage id="order.itemSticker" />
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        <FormattedMessage id="order.itemStickerDesc" />
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      <FormattedMessage id="order.itemFree" />
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        <FormattedMessage id="order.itemSub" />
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        <FormattedMessage id="order.itemSubDesc" />
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">€10.00</span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        <FormattedMessage id="order.itemShipping" />
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        <FormattedMessage id="order.letterboxNotice" />
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      <FormattedMessage id="order.itemFree" />
                    </span>
                  </div>
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {/* Total */}
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    <FormattedMessage id="order.total" />
                  </span>
                  <div className="text-right">
                    <span className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                      €10.00
                    </span>
                    <span className="text-xs text-slate-400 block">
                      <FormattedMessage id="pricing.mainInterval" />
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <FormattedMessage id="order.renewalNote" />
                </p>

                {/* Highlights */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <FormattedMessage id="order.cancelAnytime" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <FormattedMessage id="order.letterboxNotice" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <FormattedMessage id="order.secureCheckout" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 4: Success Screen */
          <div className="max-w-xl mx-auto py-6 sm:py-10 space-y-8 text-center">
            {/* Animated Check Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-4 border-emerald-200 dark:border-emerald-800 text-emerald-600 shadow-xl shadow-emerald-600/10 animate-bounce">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                <FormattedMessage id="order.successTitle" />
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                <FormattedMessage id="order.successSubtitle" />
              </p>
            </div>

            {/* Order Confirmation Card */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-lg text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  <FormattedMessage id="order.orderNumber" />
                </span>
                <span className="font-mono font-bold text-sm text-slate-800 dark:text-slate-200">
                  {orderId}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  <FormattedMessage id="order.stickerToken" />
                </span>
                <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                  {stickerToken}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  <FormattedMessage id="order.linkedVehicle" />
                </span>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {plate} • {make} {model}
                </span>
              </div>

              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  <FormattedMessage id="order.dispatchedTo" />
                </span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-right">
                  {fullName}
                  <br />
                  {street} {houseNumber}
                  {addition ? ` ${addition}` : ""}
                  <br />
                  {postalCode} {city}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center gap-3 text-xs text-amber-800 dark:text-amber-300">
                <Truck className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <FormattedMessage id="order.postnlEstimated" />
                </span>
              </div>
            </div>

            {/* Magic Link Notification Card */}
            <div className="rounded-3xl bg-emerald-50/90 dark:bg-emerald-950/40 border-2 border-emerald-500/30 p-6 sm:p-7 text-left space-y-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 mb-1">
                    <FormattedMessage id="order.magicLinkBadge" />
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    <FormattedMessage id="order.magicLinkTitle" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <FormattedMessage
                      id="order.magicLinkDesc"
                      values={{
                        email: <strong className="font-bold text-slate-900 dark:text-white">{email}</strong>,
                      }}
                    />
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  <FormattedMessage id="order.magicLinkSpamNotice" />
                </span>
                <button
                  type="button"
                  onClick={handleResendMagicLink}
                  disabled={resendingMagicLink}
                  className="inline-flex items-center justify-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer disabled:opacity-50"
                >
                  {resendingMagicLink ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <FormattedMessage id="order.resendingMagicLink" />
                    </>
                  ) : magicLinkResent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <FormattedMessage id="order.magicLinkResent" />
                    </>
                  ) : (
                    <FormattedMessage id="order.resendMagicLink" />
                  )}
                </button>
              </div>
            </div>

            {/* Back to Home Button */}
            <div className="pt-2 flex justify-center">
              <Link href="/">
                <Button variant="outline" size="md" className="rounded-2xl text-xs font-bold px-6">
                  <FormattedMessage id="common.backToHome" />
                </Button>
              </Link>
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}
