"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ShieldCheck, MessageCircle, SunMedium, Smartphone, Lock, RefreshCw } from "lucide-react";

export function Features() {
  const features = [
    { icon: ShieldCheck, titleId: "features.f1Title", descId: "features.f1Desc" },
    { icon: MessageCircle, titleId: "features.f2Title", descId: "features.f2Desc" },
    { icon: Smartphone, titleId: "features.f3Title", descId: "features.f3Desc" },
    { icon: SunMedium, titleId: "features.f4Title", descId: "features.f4Desc" },
    { icon: Lock, titleId: "features.f5Title", descId: "features.f5Desc" },
    { icon: RefreshCw, titleId: "features.f6Title", descId: "features.f6Desc" },
  ];

  return (
    <section id="voordelen" className="relative py-12 sm:py-20 transition-colors">
      <span id="benefits" className="absolute -top-24 block" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagId="features.tag"
          titleId="features.title"
          subtitleId="features.subtitle"
          tagColor="emerald"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-4 sm:p-6 bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/40 transition-colors flex sm:flex-col items-start gap-3.5 sm:gap-0 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center sm:mb-4 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1 sm:mb-2">
                    <FormattedMessage id={f.titleId} />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    <FormattedMessage id={f.descId} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
