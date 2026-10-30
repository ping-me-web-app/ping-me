"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/useAuth";
import { Check, Truck, ShieldCheck, Sparkles, RefreshCw, ArrowRight, Server, MessageSquare, Zap } from "lucide-react";

export function PricingSection() {
  const { isLoggedIn, mounted } = useAuth();
  const loggedIn = mounted && isLoggedIn;
  return (
    <section id="prijzen" className="relative py-20 transition-colors">
      <span id="pricing" className="absolute -top-24 block" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tagId="pricing.tag"
          titleId="pricing.title"
          subtitleId="pricing.subtitle"
          tagColor="emerald"
        />

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {/* Main Plan: €10 / year */}
          <div className="md:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xl p-6 sm:p-8 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 right-6">
              {loggedIn ? (
                <Badge variant="success" className="py-1 px-3 shadow-sm bg-emerald-600 text-white border-emerald-500">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  <FormattedMessage id="pricing.alreadySubscribedBadge" />
                </Badge>
              ) : (
                <Badge variant="brand" className="py-1 px-3 shadow-sm bg-emerald-600 text-white border-emerald-500">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <FormattedMessage id="pricing.mainBadge" />
                </Badge>
              )}
            </div>

            <div>
              <div className="mb-4">
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
                  <FormattedMessage id="pricing.mainTitle" />
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  <FormattedMessage id="pricing.mainDesc" />
                </p>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="font-display font-extrabold text-5xl text-slate-900 dark:text-white">
                  €<FormattedMessage id="pricing.mainPrice" />
                </span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  <FormattedMessage id="pricing.mainInterval" />
                </span>
              </div>

              <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800 pt-6 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong><FormattedMessage id="pricing.fSticker" /></strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fPostNL" /></span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fChannel" /></span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fScans" /></span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fPortal" /></span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              {loggedIn ? (
                <Button
                  href="/dashboard"
                  size="lg"
                  className="w-full shadow-lg shadow-emerald-600/20"
                >
                  <FormattedMessage id="pricing.mainCtaManage" />
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  href="/order"
                  size="lg"
                  className="w-full shadow-lg shadow-emerald-600/20"
                >
                  <FormattedMessage id="pricing.mainCta" />
                </Button>
              )}
              <p className="text-center text-[11px] text-slate-400 mt-2.5">
                <FormattedMessage id="pricing.ctaNote" />
              </p>
            </div>
          </div>

          {/* Replacement Sticker Card: €5 */}
          <div className="md:col-span-5 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                <FormattedMessage id="pricing.repTitle" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                <FormattedMessage id="pricing.repDesc" />
              </p>

              <div className="flex items-baseline gap-2 my-5">
                <span className="font-display font-bold text-3xl text-slate-900 dark:text-white">
                  €<FormattedMessage id="pricing.repPrice" />
                </span>
                <span className="text-slate-400 text-xs">
                  <FormattedMessage id="pricing.repOneTime" />
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span><FormattedMessage id="pricing.repPostNL" /></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-500" />
                  <span><FormattedMessage id="pricing.repLinkAccount" /></span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
              <Button
                href="/dashboard"
                variant="outline"
                size="md"
                className="w-full text-xs"
              >
                <FormattedMessage id="pricing.repCta" />
              </Button>
            </div>
          </div>
        </div>

        {/* Value Justification: "Why €10/year?" Transparent Friction Remover */}
        <div className="max-w-4xl mx-auto mt-8 p-6 sm:p-7 rounded-3xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">
                <FormattedMessage id="pricing.whyTitle" />
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                <FormattedMessage id="pricing.whyDesc" />
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><FormattedMessage id="pricing.whyPoint1" /></span>
            </div>
            <div className="flex items-start gap-2">
              <Server className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span><FormattedMessage id="pricing.whyPoint2" /></span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
              <span><FormattedMessage id="pricing.whyPoint3" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
