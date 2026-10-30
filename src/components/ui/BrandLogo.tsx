"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  href?: string;
}

export function BrandLogo({ size = "md", className, href = "/" }: BrandLogoProps) {
  const heightClass = {
    xs: "h-[22px] sm:h-[26px] w-auto",
    sm: "h-[30px] sm:h-[38px] w-auto",
    md: "h-[38px] sm:h-[48px] md:h-[58px] w-auto",
    lg: "h-[64px] sm:h-[84px] w-auto",
    xl: "h-[84px] sm:h-[110px] w-auto",
  }[size];

  const content = (
    <div className={cn("inline-flex items-center justify-center transition-transform hover:scale-[1.02]", className)}>
      {/* Dark version for Light mode */}
      <img
        src="/logo-dark.png"
        alt="Ping Me"
        className={cn(
          "block dark:hidden object-contain select-none",
          heightClass
        )}
      />
      {/* Light version for Dark mode */}
      <img
        src="/logo-light.png"
        alt="Ping Me"
        className={cn(
          "hidden dark:block object-contain select-none",
          heightClass
        )}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block" aria-label="Ping Me homepage">
        {content}
      </Link>
    );
  }

  return content;
}
