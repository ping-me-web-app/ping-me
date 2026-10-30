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
        {/* iOS Top Status Bar (Clock on left, transparent spacer for frame's Dynamic Island, Indicators on right) */}
        {showStatusBar && (
          <div className="relative z-10 flex items-center justify-between px-6 pt-2 pb-1 text-slate-800 dark:text-slate-100 text-[11px] font-semibold tracking-tight select-none flex-shrink-0 bg-transparent">
            {/* Clock */}
            <span
              suppressHydrationWarning
              className="w-14 text-left font-sans font-semibold text-[11px] sm:text-[12px] tabular-nums"
            >
              {timeStr || "09:41"}
            </span>

            {/* Invisible Dynamic Island Spacer so clock & indicators sit on either side of the frame's cutout */}
            <div className="w-24 sm:w-28 h-6 pointer-events-none flex-shrink-0" />

            {/* Right Indicators: Cellular Bars, 5G, Wifi, Battery */}
            <div className="w-14 flex items-center justify-end gap-1.5 text-slate-800 dark:text-slate-100">
              {/* 4 Cellular Signal Bars */}
              <div className="flex items-end gap-[1.5px] h-2.5 pb-[0.5px]">
                <span className="w-[2px] h-[3px] bg-current rounded-full" />
                <span className="w-[2px] h-[5px] bg-current rounded-full" />
                <span className="w-[2px] h-[7px] bg-current rounded-full" />
                <span className="w-[2px] h-[9px] bg-current rounded-full" />
              </div>

              {/* 5G text */}
              <span className="font-sans font-bold text-[9px] leading-none">5G</span>

              {/* Wifi */}
              <Wifi className="w-3 h-3 stroke-[2.2]" />

              {/* iOS Battery with Terminal Nub */}
              <div className="relative flex items-center">
                <div className="w-[18px] h-[9px] rounded-[3px] border border-current p-[1px] flex items-center">
                  <div className="h-full w-full bg-current rounded-[1.5px]" />
                </div>
                <div className="w-[1px] h-[3.5px] bg-current rounded-r-[1px] ml-[0.5px]" />
              </div>
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
