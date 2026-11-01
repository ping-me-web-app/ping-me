"use client";

import React, { useRef, useState, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/useAuth";
import {
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Server,
  MessageSquare,
  Zap,
} from "lucide-react";

export function PricingSection() {
  const { isLoggedIn, mounted } = useAuth();
  const loggedIn = mounted && isLoggedIn;

  // Mobile Carousel State & Refs
  const carouselRef = useRef<HTMLDivElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const cardRefs = [card0Ref, card1Ref, card2Ref];
  const [activeIndex, setActiveIndex] = useState(1); // 2 years (index 1) active by default

  // Center the 2-year card on mobile mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cardRefs[1].current && carouselRef.current) {
        cardRefs[1].current.scrollIntoView({
          behavior: "auto",
          inline: "center",
          block: "nearest",
        });
      }
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Update active index based on horizontal scroll position
  const handleScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIdx = 0;
    let closestDist = Infinity;

    cardRefs.forEach((ref, idx) => {
      if (ref.current) {
        const cardCenter = ref.current.offsetLeft + ref.current.offsetWidth / 2;
        const dist = Math.abs(containerCenter - cardCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      }
    });

    setActiveIndex(closestIdx);
  };

  const scrollToCard = (index: number) => {
    if (cardRefs[index].current) {
      cardRefs[index].current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveIndex(index);
    }
  };

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

        {/* Zero Commitment Badge */}
        <div className="flex justify-center -mt-6 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <FormattedMessage id="pricing.noAutoRenewBadge" />
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* MOBILE CAROUSEL (< md)                                        */}
        {/* Shows 2 Years centered with parts of 1 and 3 years peeking in */}
        {/* ------------------------------------------------------------- */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none py-6 px-[8vw] gap-3.5 scroll-smooth items-stretch"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Card 0: 1 Year (€10.00) */}
            <div
              ref={card0Ref}
              onClick={() => {
                if (activeIndex !== 0) scrollToCard(0);
              }}
              className={`w-[76vw] max-w-[320px] shrink-0 snap-center rounded-3xl bg-white dark:bg-slate-900 border p-6 flex flex-col justify-between relative transition-all duration-300 ${
                activeIndex === 0
                  ? "border-emerald-500 shadow-xl scale-100 opacity-100"
                  : "border-slate-200 dark:border-slate-800 shadow-sm scale-95 opacity-70 hover:opacity-90 cursor-pointer"
              }`}
            >
              <div>
                <div className="mb-4">
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    <FormattedMessage id="pricing.tier1Title" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <FormattedMessage id="pricing.tier1Desc" />
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 mb-5">
                  <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                    €<FormattedMessage id="pricing.tier1Price" />
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    <FormattedMessage id="pricing.tier1Rate" />
                  </span>
                </div>

                <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong><FormattedMessage id="pricing.fSticker" /></strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><FormattedMessage id="pricing.fPostNL" /></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><FormattedMessage id="pricing.fChannel" /></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><FormattedMessage id="pricing.fNoAutoRenew" /></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  href={loggedIn ? "/dashboard" : "/order?years=1"}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold"
                >
                  {loggedIn ? (
                    <FormattedMessage id="pricing.mainCtaManage" />
                  ) : (
                    <FormattedMessage id="pricing.tier1Cta" />
                  )}
                </Button>
              </div>
            </div>

            {/* Card 1: 2 Years (€15.99) - HIGHLIGHTED / MIDDLE OPTION */}
            <div
              ref={card1Ref}
              onClick={() => {
                if (activeIndex !== 1) scrollToCard(1);
              }}
              className={`w-[76vw] max-w-[320px] shrink-0 snap-center rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 p-6 flex flex-col justify-between relative transition-all duration-300 ${
                activeIndex === 1
                  ? "shadow-2xl shadow-emerald-500/20 scale-100 opacity-100 ring-2 ring-emerald-500/30"
                  : "shadow-md scale-95 opacity-70 hover:opacity-90 cursor-pointer"
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge
                  variant="brand"
                  className="py-0.5 px-2.5 shadow-sm bg-emerald-600 text-white border-emerald-500 flex items-center gap-1 text-[10px] font-bold"
                >
                  <Sparkles className="w-3 h-3 text-emerald-200" />
                  <FormattedMessage id="pricing.tier2Badge" />
                </Badge>
              </div>

              <div>
                <div className="mb-4 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                      <FormattedMessage id="pricing.tier2Title" />
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                      <FormattedMessage id="pricing.tier2Savings" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <FormattedMessage id="pricing.tier2Desc" />
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 mb-5">
                  <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                    €<FormattedMessage id="pricing.tier2Price" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <FormattedMessage id="pricing.tier2Rate" />
                  </span>
                </div>

                <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong><FormattedMessage id="pricing.fSticker" /></strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><FormattedMessage id="pricing.fPostNL" /></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><FormattedMessage id="pricing.fChannel" /></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong><FormattedMessage id="pricing.fNoAutoRenew" /></strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  href={loggedIn ? "/dashboard" : "/order?years=2"}
                  size="sm"
                  className="w-full shadow-lg shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  {loggedIn ? (
                    <>
                      <FormattedMessage id="pricing.mainCtaManage" />
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  ) : (
                    <FormattedMessage id="pricing.tier2Cta" />
                  )}
                </Button>
              </div>
            </div>

            {/* Card 2: 3 Years (€20.99) */}
            <div
              ref={card2Ref}
              onClick={() => {
                if (activeIndex !== 2) scrollToCard(2);
              }}
              className={`w-[76vw] max-w-[320px] shrink-0 snap-center rounded-3xl bg-white dark:bg-slate-900 border p-6 flex flex-col justify-between relative transition-all duration-300 ${
                activeIndex === 2
                  ? "border-sky-500 shadow-xl scale-100 opacity-100"
                  : "border-slate-200 dark:border-slate-800 shadow-sm scale-95 opacity-70 hover:opacity-90 cursor-pointer"
              }`}
            >
              <div>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                      <FormattedMessage id="pricing.tier3Title" />
                    </h3>
                    <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                      <FormattedMessage id="pricing.tier3Savings" />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <FormattedMessage id="pricing.tier3Desc" />
                  </p>
                </div>

                <div className="flex items-baseline gap-1.5 mb-5">
                  <span className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
                    €<FormattedMessage id="pricing.tier3Price" />
                  </span>
                  <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    <FormattedMessage id="pricing.tier3Rate" />
                  </span>
                </div>

                <div className="space-y-2.5 border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong><FormattedMessage id="pricing.fSticker" /></strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><FormattedMessage id="pricing.fPostNL" /></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><FormattedMessage id="pricing.fChannel" /></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><FormattedMessage id="pricing.fNoAutoRenew" /></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  href={loggedIn ? "/dashboard" : "/order?years=3"}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold"
                >
                  {loggedIn ? (
                    <FormattedMessage id="pricing.mainCtaManage" />
                  ) : (
                    <FormattedMessage id="pricing.tier3Cta" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Dot Indicators */}
          <div className="flex justify-center items-center gap-2 mt-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToCard(idx)}
                className={`transition-all rounded-full ${
                  activeIndex === idx
                    ? "w-6 h-2 bg-emerald-500"
                    : "w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                aria-label={`Go to plan ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DESKTOP 3-COLUMN GRID (>= md)                                  */}
        {/* ------------------------------------------------------------- */}
        <div className="hidden md:grid md:grid-cols-3 max-w-5xl mx-auto gap-6 lg:gap-8 items-stretch">
          {/* Tier 1: 1 Year (€10.00) */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col justify-between relative">
            <div>
              <div className="mb-4">
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  <FormattedMessage id="pricing.tier1Title" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <FormattedMessage id="pricing.tier1Desc" />
                </p>
              </div>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display font-extrabold text-4xl text-slate-900 dark:text-white">
                  €<FormattedMessage id="pricing.tier1Price" />
                </span>
                <span className="text-xs font-medium text-slate-400">
                  <FormattedMessage id="pricing.tier1Rate" />
                </span>
              </div>

              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong><FormattedMessage id="pricing.fSticker" /></strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fPostNL" /></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fChannel" /></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fNoAutoRenew" /></span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
              <Button
                href={loggedIn ? "/dashboard" : "/order?years=1"}
                variant="outline"
                size="md"
                className="w-full text-xs font-bold"
              >
                {loggedIn ? (
                  <FormattedMessage id="pricing.mainCtaManage" />
                ) : (
                  <FormattedMessage id="pricing.tier1Cta" />
                )}
              </Button>
            </div>
          </div>

          {/* Tier 2: 2 Years (€15.99) - HIGHLIGHTED / RECOMMENDED */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 p-6 sm:p-7 flex flex-col justify-between relative transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <Badge
                variant="brand"
                className="py-1 px-3 shadow-sm bg-emerald-600 text-white border-emerald-500 flex items-center gap-1 text-[11px] font-bold"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <FormattedMessage id="pricing.tier2Badge" />
              </Badge>
            </div>

            <div>
              <div className="mb-4 pt-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    <FormattedMessage id="pricing.tier2Title" />
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                    <FormattedMessage id="pricing.tier2Savings" />
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <FormattedMessage id="pricing.tier2Desc" />
                </p>
              </div>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display font-extrabold text-4xl text-slate-900 dark:text-white">
                  €<FormattedMessage id="pricing.tier2Price" />
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <FormattedMessage id="pricing.tier2Rate" />
                </span>
              </div>

              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong><FormattedMessage id="pricing.fSticker" /></strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fPostNL" /></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fChannel" /></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fScans" /></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong><FormattedMessage id="pricing.fNoAutoRenew" /></strong></span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
              <Button
                href={loggedIn ? "/dashboard" : "/order?years=2"}
                size="md"
                className="w-full shadow-lg shadow-emerald-600/25 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                {loggedIn ? (
                  <>
                    <FormattedMessage id="pricing.mainCtaManage" />
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                ) : (
                  <FormattedMessage id="pricing.tier2Cta" />
                )}
              </Button>
            </div>
          </div>

          {/* Tier 3: 3 Years (€20.99) */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-7 flex flex-col justify-between relative">
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                    <FormattedMessage id="pricing.tier3Title" />
                  </h3>
                  <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                    <FormattedMessage id="pricing.tier3Savings" />
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <FormattedMessage id="pricing.tier3Desc" />
                </p>
              </div>

              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="font-display font-extrabold text-4xl text-slate-900 dark:text-white">
                  €<FormattedMessage id="pricing.tier3Price" />
                </span>
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                  <FormattedMessage id="pricing.tier3Rate" />
                </span>
              </div>

              <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><strong><FormattedMessage id="pricing.fSticker" /></strong></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fPostNL" /></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fChannel" /></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span><FormattedMessage id="pricing.fNoAutoRenew" /></span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800">
              <Button
                href={loggedIn ? "/dashboard" : "/order?years=3"}
                variant="outline"
                size="md"
                className="w-full text-xs font-bold"
              >
                {loggedIn ? (
                  <FormattedMessage id="pricing.mainCtaManage" />
                ) : (
                  <FormattedMessage id="pricing.tier3Cta" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FULL-WIDTH VALUE JUSTIFICATION ("Why Ping Me?")               */}
        {/* ------------------------------------------------------------- */}
        <div className="max-w-5xl mx-auto mt-10 p-6 sm:p-8 rounded-3xl bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200/90 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-slate-900 dark:text-white text-base">
                <FormattedMessage id="pricing.whyTitle" />
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            <FormattedMessage id="pricing.whyDesc" />
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex items-start gap-2.5 p-2.5 sm:p-0 rounded-xl bg-white/70 dark:bg-slate-800/50 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/50 dark:border-slate-700/50 sm:border-0">
              <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><FormattedMessage id="pricing.whyPoint1" /></span>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 sm:p-0 rounded-xl bg-white/70 dark:bg-slate-800/50 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/50 dark:border-slate-700/50 sm:border-0">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><FormattedMessage id="pricing.whyPoint2" /></span>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 sm:p-0 rounded-xl bg-white/70 dark:bg-slate-800/50 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/50 dark:border-slate-700/50 sm:border-0">
              <Server className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span><FormattedMessage id="pricing.whyPoint3" /></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
