"use client";

import React from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PhoneMockup } from "@/components/common/PhoneMockup";
import { TagAlertForm } from "@/components/tag/TagAlertForm";
import {
  QrCode,
  SlidersHorizontal,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function ScannerDemo() {
  return (
    <section
      id="ervaar-het-zelf"
      className="py-20 sm:py-28 bg-slate-50 dark:bg-[#080D17] border-y border-slate-200/80 dark:border-slate-800/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagId="scannerDemo.tag"
          titleId="scannerDemo.title"
          subtitleId="scannerDemo.subtitle"
          tagColor="emerald"
        />

        <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
          {/* Left Column: Photorealistic iPhone 16 Pro Mockup with Live Standalone Tag Form */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Live Interactive Tag Above Phone */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              <FormattedMessage id="scannerDemo.liveDemoTag" />
            </div>

            {/* Reused Phone Mockup with scrollable standalone TagAlertForm inside */}
            <div className="w-full flex justify-center">
              <PhoneMockup
                maxWidthClass="max-w-[360px] sm:max-w-[410px] lg:max-w-[440px] xl:max-w-[460px]"
                screenClassName="bg-white dark:bg-[#0B1119]"
              >
                <div className="px-4 pt-5 pb-4 sm:px-5 sm:pt-6">
                  <TagAlertForm isEmbedded={true} />
                </div>
              </PhoneMockup>
            </div>
          </div>

          {/* Right Column: Vertical Cards Highlighting the Steps */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            {/* Step 1 Card */}
            <div className="group rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      <FormattedMessage id="scannerDemo.step1Badge" />
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      <FormattedMessage id="scannerDemo.step1Title" />
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <FormattedMessage id="scannerDemo.step1Desc" />
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="group rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                      <FormattedMessage id="scannerDemo.step2Badge" />
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      <FormattedMessage id="scannerDemo.step2Title" />
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <FormattedMessage id="scannerDemo.step2Desc" />
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="group rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      <FormattedMessage id="scannerDemo.step3Badge" />
                    </span>
                    <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                      <FormattedMessage id="scannerDemo.step3Title" />
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <FormattedMessage id="scannerDemo.step3Desc" />
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Callout Banner & Quick Order Link */}
            <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-medium leading-snug">
                <FormattedMessage id="scannerDemo.liveDemoHint" />
              </p>
              <Link
                href="/order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex-shrink-0"
              >
                <span>
                  <FormattedMessage id="scannerDemo.ctaOrder" />
                </span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
