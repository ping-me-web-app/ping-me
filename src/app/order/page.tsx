"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormattedMessage, useIntl } from "react-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useAuth } from "@/lib/useAuth";
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
type PaymentMethod = "ideal" | "card" | "apple_pay";

const DUTCH_BANKS = [
  "ING Bank",
  "Rabobank",
  "ABN AMRO",
  "SNS Bank",
  "Bunq",
  "ASN Bank",
  "RegioBank",
  "Knab",
];

export default function OrderPage() {
  const intl = useIntl();
  const router = useRouter();
  const { login } = useAuth();

  // Stepper state: 1 = Vehicle/Alerts, 2 = Shipping, 3 = Payment, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

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

  // Form State - Step 3: Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ideal");
  const [selectedBank, setSelectedBank] = useState("ING Bank");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Form State - Step 4: Success Results
  const [orderId, setOrderId] = useState("");
  const [stickerToken, setStickerToken] = useState("");

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

  // Step 1 Validation
  const canContinueStep1 =
    plate.trim().length >= 6 &&
    email.trim().includes("@") &&
    phone.trim().length >= 8;

  // Step 2 Validation
  const canContinueStep2 =
    fullName.trim().length > 2 &&
    postalCode.trim().length >= 5 &&
    houseNumber.trim().length > 0 &&
    street.trim().length > 0 &&
    city.trim().length > 0;

  // Handle Mock Payment Execution
  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);

    // Simulate realistic bank / payment gateway communication
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const generatedOrderId = `PM-NL-${Math.floor(100000 + Math.random() * 900000)}`;
    const generatedToken = `PM-NL-${Math.floor(1000 + Math.random() * 9000)}`;

    setOrderId(generatedOrderId);
    setStickerToken(generatedToken);

    // Store user vehicle and session locally
    const vehicleData = {
      plate: plate.toUpperCase(),
      make: make || "Volkswagen",
      model: model || "Golf",
      color: color || "Black",
      token: generatedToken,
      channel,
      phone,
      email,
      fullName,
      postalCode,
      houseNumber,
      addition,
      street,
      city,
      address: `${street} ${houseNumber}${addition ? ` ${addition}` : ""}, ${postalCode} ${city}`,
      paymentMethod,
      selectedBank: paymentMethod === "ideal" ? selectedBank : "Creditcard",
      orderId: generatedOrderId,
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("pingme-user-vehicle", JSON.stringify(vehicleData));
      localStorage.setItem("pingme-has-session", "true");
    }

    // Call auth hook login
    login();

    setIsProcessingPayment(false);
    setStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Checkout Minimal Header */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-[#0B1117]/90 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <BrandLogo size="md" />
          </Link>

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
        {/* Stepper Progress Bar */}
        {step < 4 && (
          <div className="max-w-3xl mx-auto mb-8 sm:mb-12">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              {[
                { s: 1, labelId: "order.step1" },
                { s: 2, labelId: "order.step2" },
                { s: 3, labelId: "order.step3" },
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
        {step < 4 ? (
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
                      <div className="inline-flex items-center rounded-xl bg-[#FFD700] border-2 border-black shadow-md overflow-hidden font-mono font-black text-xl tracking-wider select-none text-black h-12 w-fit">
                        <div className="bg-[#003399] text-white px-2.5 h-full flex flex-col items-center justify-center text-[10px] leading-tight font-sans">
                          <span className="text-[9px]">★</span>
                          <span className="font-bold">NL</span>
                        </div>
                        <input
                          type="text"
                          value={plate}
                          onChange={(e) => setPlate(e.target.value.toUpperCase())}
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
                  </div>

                  {/* Make, Model, Color (Auto-filled by RDW, or editable) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <FormattedMessage id="order.makeLabel" />
                      </label>
                      <input
                        type="text"
                        value={model ? `${make} ${model}` : make}
                        onChange={(e) => setMake(e.target.value)}
                        placeholder={intl.formatMessage({ id: "order.makePlaceholder" })}
                        className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        <FormattedMessage id="order.colorLabel" />
                      </label>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder={intl.formatMessage({ id: "order.colorPlaceholder" })}
                        className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                          placeholder={intl.formatMessage({ id: "order.phonePlaceholder" })}
                          required
                          className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          <FormattedMessage id="order.phoneHelper" />
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.emailLabel" />
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={intl.formatMessage({ id: "order.emailPlaceholder" })}
                          required
                          className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          <FormattedMessage id="order.emailHelper" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="pt-4">
                    <Button
                      type="button"
                      size="lg"
                      disabled={!canContinueStep1}
                      onClick={() => setStep(2)}
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
                        placeholder={intl.formatMessage({ id: "order.fullNamePlaceholder" })}
                        required
                        className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Postal Code + House Number + Suffix */}
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-5 sm:col-span-5">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.postalCodeLabel" />
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                          placeholder={intl.formatMessage({ id: "order.postalCodePlaceholder" })}
                          required
                          className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-4">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.houseNumberLabel" />
                        </label>
                        <input
                          type="text"
                          value={houseNumber}
                          onChange={(e) => setHouseNumber(e.target.value)}
                          placeholder={intl.formatMessage({ id: "order.houseNumberPlaceholder" })}
                          required
                          className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
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

                    {/* Street and City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.streetLabel" />
                        </label>
                        <input
                          type="text"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder={intl.formatMessage({ id: "order.streetPlaceholder" })}
                          required
                          className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.cityLabel" />
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder={intl.formatMessage({ id: "order.cityPlaceholder" })}
                          required
                          className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setStep(1)}
                      className="w-1/3"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <FormattedMessage id="order.btnBack" />
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      disabled={!canContinueStep2}
                      onClick={() => setStep(3)}
                      className="w-2/3 shadow-lg shadow-emerald-600/20"
                    >
                      <FormattedMessage id="order.btnContinuePayment" />
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: Review & Mock Payment */}
              {step === 3 && (
                <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
                  <div>
                    <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
                      <FormattedMessage id="order.paymentTitle" />
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <FormattedMessage id="order.paymentSubtitle" />
                    </p>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      <FormattedMessage id="order.paymentMethod" />
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* iDEAL */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("ideal")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          paymentMethod === "ideal"
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                        }`}
                      >
                        <Building2 className="w-5 h-5 text-rose-500 mb-2" />
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          <FormattedMessage id="order.ideal" />
                        </div>
                        <div className="text-[11px] text-slate-400">Dutch Online Banking</div>
                      </button>

                      {/* Credit Card */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          paymentMethod === "card"
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-sky-500 mb-2" />
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          <FormattedMessage id="order.creditCard" />
                        </div>
                        <div className="text-[11px] text-slate-400">Visa / Mastercard</div>
                      </button>

                      {/* Apple Pay */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("apple_pay")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          paymentMethod === "apple_pay"
                            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
                        }`}
                      >
                        <Sparkles className="w-5 h-5 text-indigo-500 mb-2" />
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          <FormattedMessage id="order.applePay" />
                        </div>
                        <div className="text-[11px] text-slate-400">1-Touch Pay</div>
                      </button>
                    </div>

                    {/* Bank selector for iDEAL */}
                    {paymentMethod === "ideal" && (
                      <div className="pt-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          <FormattedMessage id="order.idealBank" />
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {DUTCH_BANKS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Demo notification banner */}
                  <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 text-xs text-sky-800 dark:text-sky-300 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>
                      <FormattedMessage id="order.mockNotice" />
                    </span>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      disabled={isProcessingPayment}
                      onClick={() => setStep(2)}
                      className="w-1/3"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <FormattedMessage id="order.btnBack" />
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      disabled={isProcessingPayment}
                      onClick={handleCompleteOrder}
                      className="w-2/3 shadow-lg shadow-emerald-600/25"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <FormattedMessage id="order.processingPayment" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          <FormattedMessage id="order.payButton" />
                        </>
                      )}
                    </Button>
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
                    <span className="text-xs text-slate-400 block">/ jaar</span>
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

            {/* Auto-login reassurance */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300">
              <FormattedMessage id="order.autoLoginNotice" />
            </div>

            {/* Jump to Dashboard Button */}
            <div>
              <Link href="/dashboard">
                <Button size="lg" className="w-full sm:w-auto px-8 shadow-xl shadow-emerald-600/25">
                  <FormattedMessage id="order.goToDashboard" />
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
