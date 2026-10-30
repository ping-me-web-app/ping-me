"use client";

import React from "react";
import Link from "next/link";
import { FormattedMessage, useIntl } from "react-intl";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileText, Truck, RefreshCw, CheckCircle2, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
              <FileText className="w-3.5 h-3.5" />
              <span>Algemene Voorwaarden</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
              {isNl ? "Algemene Voorwaarden" : "Terms & Conditions"}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isNl
                ? "Laatst bijgewerkt: Oktober 2026 • Heldere en eerlijke afspraken zonder kleine lettertjes."
                : "Last updated: October 2026 • Transparent, straightforward service terms with zero hidden catches."}
            </p>
          </div>

          {/* Content Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {/* Section 1 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h2>{isNl ? "1. De Dienst van Ping Me" : "1. The Ping Me Service"}</h2>
              </div>
              <p>
                {isNl
                  ? "Ping Me levert een anonieme meldingsdienst voor motorvoertuigen, bestaande uit een fysieke statische ruitsticker met unieke QR-code gekoppeld aan een beveiligde telecom-doorschakeldienst (WhatsApp, SMS of e-mail). De sticker stelt derden in staat contact op te nemen met de voertuighouder bij parkeer- of noodsituaties."
                  : "Ping Me provides an anonymous vehicle contact service consisting of a physical electrostatic windshield sticker featuring a unique QR code connected to a secure telecom relay (WhatsApp, SMS, or email). It allows passersby to contact the driver in parking or emergency situations."}
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <RefreshCw className="w-4 h-4 text-emerald-500" />
                <h2>{isNl ? "2. Abonnement, Prijzen & Opzegging" : "2. Subscription, Billing & Cancellation"}</h2>
              </div>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  {isNl
                    ? "Het jaarabonnement bedraagt €10 inclusief BTW per jaar en omvat de eerste fysieke sticker, gratis PostNL bezorging en onbeperkte notificatiedoorzending."
                    : "The annual subscription is €10 including VAT per year and includes your first physical sticker, free PostNL shipping, and unlimited notification relays."}
                </li>
                <li>
                  {isNl
                    ? "Het abonnement wordt jaarlijks automatisch verlengd en kan te allen tijde met 1 klik online worden opgezegd via het Stripe Customer Portal in je persoonlijke Dashboard."
                    : "Subscriptions renew automatically each year and can be cancelled at any time in 1 click via the Stripe Customer Portal inside your personal dashboard."}
                </li>
                <li>
                  {isNl
                    ? "Er zijn geen opzegtermijnen of annuleringskosten. Na opzegging blijft je sticker actief tot het einde van de lopende abonnementsperiode."
                    : "There are no lock-in cancellation fees. Upon cancellation, your sticker remains fully active until the conclusion of the paid billing period."}
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <Truck className="w-4 h-4 text-emerald-500" />
                <h2>{isNl ? "3. Levering & Herroepingsrecht (14 Dagen)" : "3. Shipping & 14-Day Cooling-off Period"}</h2>
              </div>
              <p>
                {isNl
                  ? "Stickers worden binnen 24 uur verzonden via PostNL brievenbuspost met Track & Trace binnen Nederland. Conform de Nederlandse wetgeving heb je als consument het recht om binnen 14 dagen na ontvangst van de fysieke sticker de aankoop zonder opgaaf van reden te herroepen."
                  : "Stickers are dispatched within 24 hours via PostNL letterbox delivery with Track & Trace across the Netherlands. In compliance with Dutch and EU consumer regulations, consumers have a statutory 14-day right of withdrawal from the date of receiving the physical product."}
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                <FileText className="w-4 h-4 text-emerald-500" />
                <h2>{isNl ? "4. Toepasselijk Recht & Bedrijfsgegevens" : "4. Governing Law & Business Details"}</h2>
              </div>
              <p>
                {isNl
                  ? "Op alle overeenkomsten is uitsluitend Nederlands recht van toepassing. Voor vragen over deze voorwaarden kun je contact opnemen via support@pingme.app of via onze Kamer van Koophandel (KVK) registratie."
                  : "All agreements are governed exclusively by Dutch law. For inquiries regarding these terms, contact us at support@pingme.app or view our Chamber of Commerce (KvK) registration details."}
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
