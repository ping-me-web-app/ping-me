"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WindshieldStickerShowcase } from "@/components/landing/WindshieldStickerShowcase";
import { Button } from "@/components/ui/Button";
import { PackageCheck, Truck, ShieldCheck, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: PackageCheck,
      badgeColor: "bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800",
      titleId: "howItWorks.step1Title",
      descId: "howItWorks.step1Desc",
    },
    {
      number: "02",
      icon: Truck,
      badgeColor: "bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      titleId: "howItWorks.step2Title",
      descId: "howItWorks.step2Desc",
    },
    {
      number: "03",
      icon: ShieldCheck,
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      titleId: "howItWorks.step3Title",
      descId: "howItWorks.step3Desc",
    },
  ];

  return (
    <section id="hoe-het-werkt" className="relative py-12 sm:py-20 bg-slate-50 dark:bg-[#070B12] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <span id="how-it-works" className="absolute -top-24 block" aria-hidden="true" />
      <span id="sticker" className="absolute -top-24 block" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagId="howItWorks.tag"
          titleId="howItWorks.title"
          subtitleId="howItWorks.subtitle"
          tagColor="emerald"
        />

        <div className="mt-8 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          {/* Photorealistic Windshield Sticker Showcase - on mobile positioned between title and step cards */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-1">
            <WindshieldStickerShowcase className="w-full" />
          </div>

          {/* 3 Sequential Journey Steps + CTA */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-5 order-2 lg:order-2">
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.number}
                  className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3.5 sm:gap-5">
                    {/* Step Icon & Number */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center ${step.badgeColor} shadow-2xs`}>
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className="font-display font-black text-xs text-slate-300 dark:text-slate-600 mt-1">
                        {step.number}
                      </span>
                    </div>

                    {/* Step Description */}
                    <div className="space-y-1 flex-1">
                      <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                        <FormattedMessage id={step.titleId} />
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <FormattedMessage id={step.descId} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Order CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20">
              <p className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-200 text-center sm:text-left">
                <FormattedMessage
                  id="howItWorks.ctaHint"
                  defaultMessage="Binnen 24 uur verzonden via PostNL brievenbuspost met Track & Trace."
                />
              </p>
              <Button
                href="/order"
                size="md"
                className="w-full sm:w-auto shadow-md shadow-emerald-600/20 shrink-0"
              >
                <FormattedMessage id="hero.ctaPrimary" defaultMessage="Bestel jouw sticker (€10/jr)" />
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
