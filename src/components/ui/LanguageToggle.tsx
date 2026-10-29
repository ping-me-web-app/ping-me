"use client";

import React from "react";
import { useLocale } from "@/context/IntlProviderWrapper";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function LanguageToggle({ className, size = "md" }: LanguageToggleProps) {
  const { locale, toggleLocale } = useLocale();

  const sizeClasses = size === "sm" ? "h-9 px-2.5 text-[11px]" : "h-10 px-3.5 text-xs";

  return (
    <button
      onClick={toggleLocale}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer",
        sizeClasses,
        className
      )}
      title={locale === "en" ? "Schakel naar Nederlands" : "Switch to English"}
      aria-label="Language selector"
    >
      {locale === "en" ? (
        <>
          <span className="text-base leading-none">🇬🇧</span>
          <span>EN</span>
        </>
      ) : (
        <>
          <span className="text-base leading-none">🇳🇱</span>
          <span>NL</span>
        </>
      )}
    </button>
  );
}
