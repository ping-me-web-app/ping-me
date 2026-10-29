"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PackageCheck, QrCode, BellRing } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: PackageCheck,
      titleId: "howItWorks.step1Title",
      descId: "howItWorks.step1Desc",
    },
    {
      number: "02",
      icon: QrCode,
      titleId: "howItWorks.step2Title",
      descId: "howItWorks.step2Desc",
    },
    {
      number: "03",
      icon: BellRing,
      titleId: "howItWorks.step3Title",
      descId: "howItWorks.step3Desc",
    },
  ];

  return (
    <section id="hoe-het-werkt" className="py-20 bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagId="howItWorks.tag"
          titleId="howItWorks.title"
          subtitleId="howItWorks.subtitle"
          tagColor="emerald"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/70 border border-sky-100 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="font-display font-extrabold text-3xl text-slate-200 dark:text-slate-800">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">
                  <FormattedMessage id={step.titleId} />
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <FormattedMessage id={step.descId} />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
