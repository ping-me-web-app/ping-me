"use client";

import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  ShieldCheck,
  QrCode,
  Lock,
  Flashlight,
  Camera,
  Wifi,
  Battery,
} from "lucide-react";
import { ChannelType } from "@/types";
import { useLiveClock } from "./simulator/useLiveClock";
import { SimulatorNotification } from "./simulator/SimulatorNotification";
import { ChannelFloatButtons } from "./simulator/ChannelFloatButtons";

export function HeroSimulator() {
  const [activeChannel, setActiveChannel] = useState<ChannelType>("whatsapp");
  const [animKey, setAnimKey] = useState(0);
  const [islandAlert, setIslandAlert] = useState(false);
  const { timeStr, dateStr } = useLiveClock();

  const handleSelectChannel = (channel: ChannelType) => {
    setActiveChannel(channel);
    setAnimKey((prev) => prev + 1);
    setIslandAlert(true);
    setTimeout(() => setIslandAlert(false), 900);
  };

  return (
    <div className="relative w-full max-w-[300px] sm:max-w-[360px] mx-auto select-none px-1 sm:px-0">
      {/* Floating Circular iOS Channel Switcher Buttons */}
      <ChannelFloatButtons
        activeChannel={activeChannel}
        onSelectChannel={handleSelectChannel}
      />

      {/* Photorealistic iPhone 16 Pro Device Mockup */}
      <div className="relative w-full aspect-[1406/2822] max-w-[300px] sm:max-w-[340px] mx-auto select-none drop-shadow-2xl">
        {/* Screen Area */}
        <div
          className="absolute z-10 overflow-hidden flex flex-col justify-between p-3.5 pt-3.5 text-white"
          style={{
            top: "3.54%",
            left: "7.25%",
            width: "85.77%",
            height: "92.91%",
            borderRadius: "44px",
          }}
        >
          {/* Authentic iOS Wallpaper Background */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ios-wallpaper.jpg"
            alt="iOS Wallpaper"
            className="absolute inset-0 w-full h-full object-cover -z-20 transform scale-105"
          />
          {/* Subtle gradient vignette for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-black/70 -z-10 pointer-events-none" />

          {/* Top Status Bar & Clock */}
          <div>
            <div className="flex justify-between items-center text-[10px] text-white/90 px-3 pt-0.5 font-medium tracking-tight">
              <span id="ios-sim-status-clock" suppressHydrationWarning className="w-8 text-left">
                {timeStr || "\u00A0"}
              </span>

              {/* Dynamic Island Spacer so clock & status icons never shift */}
              <div className="w-20 h-5" />

              <div className="flex items-center gap-1 text-[9px] text-white/90">
                <Wifi className="w-2.5 h-2.5" />
                <span>5G</span>
                <Battery className="w-3 h-3 fill-white/90" />
              </div>
            </div>

            {/* Lock Screen Date & Big Typography Clock */}
            <div className="mt-2 text-center min-h-[64px]">
              <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-white/85 tracking-wide min-h-[16px]">
                <Lock className="w-2.5 h-2.5 text-white/80" />
                <span id="ios-sim-date" suppressHydrationWarning>
                  {dateStr || "\u00A0"}
                </span>
              </div>
              <div
                id="ios-sim-clock"
                suppressHydrationWarning
                className="text-5xl font-display font-semibold tracking-tight text-white drop-shadow-lg leading-tight mt-0.5 min-h-[52px]"
              >
                {timeStr || "\u00A0"}
              </div>
            </div>

            {/* Immediate synchronous paint script to prevent any random time flash or flicker */}
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(){
                  try {
                    var d = new Date();
                    var h = String(d.getHours()).padStart(2, '0');
                    var m = String(d.getMinutes()).padStart(2, '0');
                    var t = h + ':' + m;
                    var c1 = document.getElementById('ios-sim-clock');
                    if (c1 && !c1.textContent.trim()) c1.textContent = t;
                    var c2 = document.getElementById('ios-sim-status-clock');
                    if (c2 && !c2.textContent.trim()) c2.textContent = t;
                    var d1 = document.getElementById('ios-sim-date');
                    if (d1 && !d1.textContent.trim()) {
                      var isNl = document.documentElement.lang === 'nl';
                      var f = new Intl.DateTimeFormat(isNl ? 'nl-NL' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
                      d1.textContent = f.charAt(0).toUpperCase() + f.slice(1);
                    }
                  } catch(e) {}
                })()`,
              }}
            />

            {/* Notification Container: Fresh Drop-In Card with iOS Spring Pop */}
            <div className="mt-2.5">
              <SimulatorNotification channel={activeChannel} animKey={animKey} />
            </div>
          </div>

          {/* Bottom Lock Screen Actions & Sticker Card */}
          <div className="pb-1">
            {/* Active Sticker Graphic */}
            <div className="rounded-xl bg-black/55 backdrop-blur-xl border border-white/15 p-2.5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center text-sky-300">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-[11px] text-white">PM-NL-8924</span>
                    <span className="px-1 py-0.2 rounded text-[8px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                      <FormattedMessage id="hero.simStickerActive" />
                    </span>
                  </div>
                  <p className="text-[9px] text-white/70">
                    <FormattedMessage id="hero.simVehicleLabel" /> <strong className="text-white">Volkswagen (K-123-XX)</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-sky-300">
                  <ShieldCheck className="w-3 h-3" />
                  <FormattedMessage id="common.anonymous" />
                </span>
              </div>
            </div>

            {/* Lock Screen Flashlight & Camera Circular Glass Buttons */}
            <div className="flex justify-between items-center px-3.5 mt-2.5">
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-md">
                <Flashlight className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-md">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            {/* Apple Home Bar */}
            <div className="w-28 h-1 bg-white/70 rounded-full mx-auto mt-2 mb-0.5" />
          </div>
        </div>

        {/* Photorealistic iPhone 16 Pro Frame Layer (Physical Titanium & Bezels) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/iphone-frame.png"
          alt="Apple iPhone 16 Pro Frame"
          className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none drop-shadow-2xl"
        />

        {/* Dynamic Island Green Light Alert */}
        <div
          className={`absolute pointer-events-none z-30 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full transition-all duration-300 ease-out select-none ${
            islandAlert
              ? "opacity-100 scale-100 bg-black ring-2 ring-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
          style={{
            top: "5.1%",
            width: islandAlert ? "31%" : "26.6%",
            height: "3.6%",
          }}
        >
          {islandAlert && (
            <div className="flex items-center gap-1.5 px-2 animate-in fade-in duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              <span className="text-[9px] font-bold text-emerald-300 tracking-wider">
                Ping Me
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
