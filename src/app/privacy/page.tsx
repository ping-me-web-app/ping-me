"use client";

import React from "react";
import Link from "next/link";
import { FormattedMessage, useIntl } from "react-intl";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const intl = useIntl();
  const isNl = intl.locale === "nl";

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 sm:py-16 bg-slate-50 dark:bg-[#080D17] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <FormattedMessage id="common.backToHome" defaultMessage="← Terug naar homepagina" />
          </Link>

          {/* Header */}
          <div className="space-y-3 mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AVG / GDPR Compliant</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {isNl ? "Privacybeleid (AVG)" : "Privacy Policy (GDPR)"}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isNl
                ? "Laatst bijgewerkt: Oktober 2026 • Ping Me respecteert en beschermt jouw privacy te allen tijde."
                : "Last updated: October 2026 • Ping Me strictly protects and respects your privacy at all times."}
            </p>
          </div>

          {/* Content Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <EyeOff className="w-4 h-4 text-emerald-500" />
                <h2>{isNl ? "1. Ons Privacy-First Principe" : "1. Our Privacy-First Principle"}</h2>
              </div>
              <p>
                {isNl
                  ? "Ping Me is ontworpen om autobezitters bereikbaar te maken zonder ooit hun persoonlijke contactgegevens vrij te geven. Wanneer iemand jouw voorruitsticker scant, ziet diegene uitsluitend een beveiligd webformulier. Jouw 06-nummer, e-mailadres en achternaam worden nóóit getoond of gedeeld met de scanner."
                  : "Ping Me is engineered to connect vehicle drivers without exposing their personal contact details. When someone scans your windshield QR tag, they only access a secure web form. Your mobile phone number, email address, and personal identity are never shown or shared with the scanning party."}
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <Lock className="w-4 h-4 text-emerald-500" />
                <h2>{isNl ? "2. Welke Gegevens Verwerken Wij?" : "2. Information We Process"}</h2>
              </div>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>{isNl ? "Kentekengegevens:" : "Vehicle Plate Data:"}</strong>{" "}
                  {isNl
                    ? "Kenteken, merk en model (gesynchroniseerd via het openbare RDW-voertuigregister)."
                    : "License plate, vehicle make, and model (synced via public RDW vehicle registries)."}
                </li>
                <li>
                  <strong>{isNl ? "Contactgegevens:" : "Alert Contact Details:"}</strong>{" "}
                  {isNl
                    ? "Het door jou gekozen notificatienummer (WhatsApp / SMS) of e-mailadres voor het ontvangen van doorgestuurde alerts."
                    : "Your designated phone number (WhatsApp/SMS) or email address for receiving relayed messages."}
                </li>
                <li>
                  <strong>{isNl ? "Verzendadres:" : "Shipping Address:"}</strong>{" "}
                  {isNl
                    ? "Naam en adres uitsluitend voor de PostNL bezorging van jouw fysieke ruitsticker."
                    : "Name and postal address solely for PostNL physical delivery of your windshield tag."}
                </li>
                <li>
                  <strong>{isNl ? "Betaalgegevens:" : "Payment Records:"}</strong>{" "}
                  {isNl
                    ? "Betalingen worden veilig verwerkt via Stripe Payments Netherlands B.V. Ping Me bewaart géén bank- of creditcardgegevens op eigen servers."
                    : "Payments are processed securely via Stripe Payments Netherlands B.V. Ping Me never stores credit card or bank details on our servers."}
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <Server className="w-4 h-4 text-emerald-500" />
                <h2>{isNl ? "3. Doorschakeling & Beveiliging" : "3. Secure Ephemeral Relay"}</h2>
              </div>
              <p>
                {isNl
                  ? "Berichten die door voorbijgangers worden verstuurd, passeren onze beveiligde telecom-proxy. Deze proxy stuurt de notificatie onmiddellijk geautomatiseerd door. Wij verkopen geen gegevens aan derden en gebruiken geen advertentietrackers."
                  : "Messages submitted by passersby pass through our secure telecom relay server. The alert is dispatched automatically and immediately. We never sell data to advertisers, and no marketing tracking pixels monitor your license plate scans."}
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h2>{isNl ? "4. Jouw AVG-Rechten" : "4. Your GDPR Rights"}</h2>
              </div>
              <p>
                {isNl
                  ? "Onder de Algemene Verordening Gegevensbescherming (AVG) heb je te allen tijde recht op inzage, correctie en volledige verwijdering van je persoonsgegevens (recht op vergetelheid). Je kunt je account en alle gekoppelde stickers op ieder moment opzeggen of permanent laten wissen via je Dashboard of door contact op te nemen met support@pingme.app."
                  : "Under the General Data Protection Regulation (GDPR), you possess full rights to view, rectify, or permanently erase your personal data. You can delete your account or deactivate linked stickers at any time via your Dashboard or by emailing support@pingme.app."}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
