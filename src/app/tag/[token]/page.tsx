"use client";

import React, { use } from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ActiveTagView } from "@/components/tag/ActiveTagView";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowRight } from "lucide-react";

interface TagPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default function TagPage({ params }: TagPageProps) {
  const resolvedParams = use(params);
  const token = resolvedParams.token || "PM-NL-8924";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col justify-between bg-slate-100 dark:bg-[#070A10] text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Floating Top Controls - Clean, borderless, no bar */}
      <div className="w-full max-w-md mx-auto px-4 pt-3.5 sm:pt-5 flex items-center justify-end gap-1.5 z-20">
        <LanguageToggle size="sm" />
        <ThemeToggle size="sm" />
      </div>

      {/* 2. Main Mobile App Body */}
      <main className="w-full max-w-md mx-auto px-4 py-2 sm:py-4 flex-1 flex flex-col justify-center">
        <ActiveTagView token={token} />
      </main>

      {/* 3. Mobile App Footer - Logo on Left, Get Yours Now Button on Right */}
      <footer className="w-full max-w-md mx-auto px-4 pt-2 pb-6 sm:pb-8">
        <div className="flex items-center justify-between gap-3">
          {/* Logo on the Left */}
          <div className="flex items-center">
            <BrandLogo size="xs" />
          </div>

          {/* Get yours now text button on the Right */}
          <Link
            href="/order"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 hover:underline transition-colors active:scale-95 py-1"
          >
            <span>
              <FormattedMessage id="tag.getYoursNow" />
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
