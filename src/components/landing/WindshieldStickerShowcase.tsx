"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { QrCode, Sparkles, ShieldCheck, Sun, CheckCircle2 } from "lucide-react";

interface WindshieldStickerShowcaseProps {
  className?: string;
  tagNumber?: string;
}

export function WindshieldStickerShowcase({
  className = "",
  tagNumber = "PM-NL-8924",
}: WindshieldStickerShowcaseProps) {
  return (
    <div className={`relative max-w-md mx-auto ${className}`}>
      {/* Outer Card with Glassmorphic Ambient Border */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-[#0E1524] dark:to-[#0A0F1A] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-7 shadow-lg sm:shadow-xl">
        {/* Header with Physical Dimensions Tag */}
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2.5 py-1 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <FormattedMessage id="sticker.showcaseBadge" defaultMessage="Fysieke Sticker Inbegrepen" />
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            70 × 70 mm
          </span>
        </div>

        {/* Sticker Realistic Cling Representation */}
        <div className="relative flex justify-center py-1 sm:py-2">
          {/* Subtle Windshield Glass Surface Background */}
          <div className="relative w-36 h-36 sm:w-52 sm:h-52 rounded-2xl p-2.5 sm:p-3 bg-gradient-to-br from-slate-900 via-black to-slate-950 border-2 border-emerald-400/40 shadow-[0_12px_36px_rgba(16,185,129,0.18)] flex flex-col justify-between items-center text-center select-none overflow-hidden isolate [transform:translateZ(0)] group">
            {/* Glass Glare / Sheen effect across sticker */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none group-hover:translate-x-full transition-transform duration-1000" />

            {/* Sticker Top Bar: Brand & Electrostatic Label */}
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-white/90 pt-0.5 px-1">
              <span className="tracking-wider uppercase text-emerald-400 font-display">Ping Me</span>
              <span className="text-[8px] uppercase tracking-widest text-slate-400 font-medium">Statisch</span>
            </div>

            {/* QR Code Container */}
            <div className="relative p-2 sm:p-2.5 bg-white rounded-xl shadow-md border border-white/40 flex items-center justify-center my-auto">
              <QrCode className="w-18 h-18 sm:w-26 sm:h-26 text-slate-950" strokeWidth={2.2} />
              {/* Center Brand Badge inside QR */}
              <div className="absolute inset-0 m-auto w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-emerald-500 text-white flex items-center justify-center font-black text-[8px] sm:text-[9px] shadow-sm">
                PM
              </div>
            </div>

            {/* Sticker Bottom Bar: Tag ID & Privacy */}
            <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] font-medium text-slate-300 pb-0.5 px-1">
              <span className="font-mono font-bold text-white text-[9px] sm:text-[10px] tracking-wide">{tagNumber}</span>
              <span className="inline-flex items-center gap-0.5 text-emerald-400">
                <ShieldCheck className="w-2.5 h-2.5" />
                100% Privé
              </span>
            </div>
          </div>
        </div>

        {/* Product Physical Benefits Grid */}
        <div className="mt-3.5 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <FormattedMessage id="sticker.featureCling" defaultMessage="0% Lijmresten" />
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <FormattedMessage id="sticker.featureDiscreet" defaultMessage="Discreet (7×7 cm)" />
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <FormattedMessage id="sticker.featureUV" defaultMessage="UV- & hittebestendig" />
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <FormattedMessage id="sticker.featurePreLinked" defaultMessage="Klaar voor gebruik" />
          </div>
        </div>
      </div>
    </div>
  );
}
