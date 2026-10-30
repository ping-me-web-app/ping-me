"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HeroSimulator } from "@/components/landing/HeroSimulator";
import { useAuth } from "@/lib/useAuth";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function Hero() {
  const { isLoggedIn, mounted } = useAuth();
  const loggedIn = mounted && isLoggedIn;

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[220px] sm:h-[350px] bg-sky-500/10 dark:bg-sky-500/15 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {loggedIn ? (
              <div className="inline-flex items-center gap-2">
                <Badge variant="success" className="py-1 px-3">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  <FormattedMessage id="hero.loggedInBadge" />
                </Badge>
              </div>
            ) : (
              <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <Badge variant="brand" className="py-1 px-3">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <FormattedMessage id="hero.badgeNL" />
                </Badge>
                <Badge variant="success" className="py-1 px-3 hidden sm:inline-flex">
                  <FormattedMessage id="hero.badgePrice" />
                </Badge>
              </div>
            )}

            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              <FormattedMessage id="hero.title" />{" "}
              <span className="text-sky-600 dark:text-sky-400">
                <FormattedMessage id="hero.titleHighlight" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              <FormattedMessage id="hero.subtitle" />
            </p>

            {/* CTAs First for Maximum Conversion */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              {loggedIn ? (
                <>
                  <Button
                    href="/dashboard"
                    size="lg"
                    className="w-full sm:w-auto shadow-lg shadow-emerald-600/25"
                  >
                    <FormattedMessage id="hero.ctaDashboard" />
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    href="/tag/PM-NL-8924"
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <FormattedMessage id="hero.ctaSecondary" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    href="/order"
                    size="lg"
                    className="w-full sm:w-auto shadow-lg shadow-emerald-600/25"
                  >
                    <FormattedMessage id="hero.ctaPrimary" />
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    href="/tag/PM-NL-8924"
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <FormattedMessage id="hero.ctaSecondary" />
                  </Button>
                </>
              )}
            </div>

            {/* Quick check bullets right below CTAs as reassurance */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <FormattedMessage id="hero.check1" />
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <FormattedMessage id="hero.check2" />
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <FormattedMessage id="hero.check3" />
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Phone Simulator */}
          <div className="lg:col-span-5 relative flex justify-center">
            <HeroSimulator />
          </div>
        </div>
      </div>
    </section>
  );
}
