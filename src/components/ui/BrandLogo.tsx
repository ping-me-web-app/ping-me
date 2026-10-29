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
    xs: "h-[26px] sm:h-[30px] w-auto",
    sm: "h-[54px] sm:h-[60px] w-auto",
    md: "h-[70px] sm:h-[82px] w-auto",
    lg: "h-[96px] sm:h-[120px] w-auto",
    xl: "h-[120px] sm:h-[144px] w-auto",
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
    return <Link href={href} className="inline-block">{content}</Link>;
  }

  return content;
}
