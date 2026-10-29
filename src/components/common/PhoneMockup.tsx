"use client";

import React from "react";
import { Wifi, Battery } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLiveClock } from "@/components/landing/simulator/useLiveClock";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  showStatusBar?: boolean;
  showHomeBar?: boolean;
  maxWidthClass?: string;
}

export function PhoneMockup({
  children,
  className,
  screenClassName,
  showStatusBar = true,
  showHomeBar = true,
  maxWidthClass = "max-w-[325px] sm:max-w-[360px]",
}: PhoneMockupProps) {
  const { timeStr } = useLiveClock();

  return (
    <div className={cn("relative w-full aspect-[1406/2822] mx-auto select-none drop-shadow-2xl", maxWidthClass, className)}>
      {/* 1. Device Screen Area */}
      <div
        className={cn(
          "absolute z-10 overflow-hidden flex flex-col justify-between bg-slate-100 dark:bg-[#070A10] text-slate-900 dark:text-slate-100 transition-colors",
          screenClassName
        )}
        style={{
          top: "3.54%",
          left: "7.25%",
          width: "85.77%",
          height: "92.91%",
          borderRadius: "44px",
        }}
      >
        {/* iOS Top Status Bar & Dynamic Island */}
        {showStatusBar && (
          <div className="relative z-30 flex items-center justify-between px-5 pt-2 pb-1 text-slate-800 dark:text-white/90 text-[10px] font-semibold tracking-tight select-none flex-shrink-0 bg-slate-100/90 dark:bg-[#070A10]/90 backdrop-blur-md">
            {/* Clock */}
            <span suppressHydrationWarning className="w-9 text-left font-mono">
              {timeStr || "09:41"}
            </span>

            {/* Dynamic Island Pill */}
            <div className="w-18 h-4.5 rounded-full bg-black flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse ml-auto mr-1.5" />
            </div>

            {/* Right Indicators */}
            <div className="flex items-center gap-1.5 text-[9px]">
              <Wifi className="w-2.5 h-2.5" />
              <span className="font-sans font-bold text-[8px]">5G</span>
              <Battery className="w-3 h-3 fill-current" />
            </div>
          </div>
        )}

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        {showHomeBar && (
          <div className="py-1.5 flex-shrink-0 bg-slate-100/90 dark:bg-[#070A10]/90 backdrop-blur-md z-30">
            <div className="w-28 h-1 bg-slate-400 dark:bg-white/40 rounded-full mx-auto" />
          </div>
        )}
      </div>

      {/* 2. Photorealistic iPhone 16 Pro Titanium Bezel Frame Layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/iphone-frame.png"
        alt="Apple iPhone 16 Pro Frame"
        className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none drop-shadow-2xl"
      />
    </div>
  );
}
