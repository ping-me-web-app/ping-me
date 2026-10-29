"use client";

import React from "react";
import {
  IosWhatsAppIcon,
  IosMessagesIcon,
  IosMailIcon,
} from "@/components/icons/channel-icons";
import { ChannelType } from "@/types";

interface ChannelFloatButtonsProps {
  activeChannel: ChannelType;
  onSelectChannel: (channel: ChannelType) => void;
}

export function ChannelFloatButtons({
  activeChannel,
  onSelectChannel,
}: ChannelFloatButtonsProps) {
  return (
    <>
      {/* 1. WhatsApp: Upper-Right Floating */}
      <div
        className={`absolute top-14 -right-5 sm:-right-8 animate-calm-float-1 transition-all duration-300 ${
          activeChannel === "whatsapp" ? "z-40" : "z-30"
        }`}
      >
        <button
          onClick={() => onSelectChannel("whatsapp")}
          title="WhatsApp (iOS)"
          aria-label="Switch to WhatsApp Alert"
          className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0 transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)] cursor-pointer select-none ${
            activeChannel === "whatsapp"
              ? "scale-[1.3] shadow-2xl shadow-emerald-500/40 opacity-100"
              : "scale-100 opacity-70 hover:opacity-100 shadow-md shadow-black/25 hover:scale-105"
          }`}
        >
          <IosWhatsAppIcon className="w-full h-full drop-shadow-md" />
          {activeChannel === "whatsapp" && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-red-500 shadow-md ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-75 duration-300">
              1
            </span>
          )}
        </button>
      </div>

      {/* 2. Messages / SMS: Middle-Left Floating */}
      <div
        className={`absolute top-60 -left-5 sm:-left-8 animate-calm-float-2 transition-all duration-300 ${
          activeChannel === "sms" ? "z-40" : "z-30"
        }`}
      >
        <button
          onClick={() => onSelectChannel("sms")}
          title="Apple Messages (iOS)"
          aria-label="Switch to SMS Alert"
          className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0 transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)] cursor-pointer select-none ${
            activeChannel === "sms"
              ? "scale-[1.3] shadow-2xl shadow-green-500/40 opacity-100"
              : "scale-100 opacity-70 hover:opacity-100 shadow-md shadow-black/25 hover:scale-105"
          }`}
        >
          <IosMessagesIcon className="w-full h-full drop-shadow-md" />
          {activeChannel === "sms" && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-red-500 shadow-md ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-75 duration-300">
              1
            </span>
          )}
        </button>
      </div>

      {/* 3. Mail: Lower-Right Floating */}
      <div
        className={`absolute bottom-28 -right-5 sm:-right-8 animate-calm-float-3 transition-all duration-300 ${
          activeChannel === "email" ? "z-40" : "z-30"
        }`}
      >
        <button
          onClick={() => onSelectChannel("email")}
          title="Apple Mail (iOS)"
          aria-label="Switch to Email Alert"
          className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0 transition-all duration-500 [transition-timing-function:cubic-bezier(0.34,1.4,0.64,1)] cursor-pointer select-none ${
            activeChannel === "email"
              ? "scale-[1.3] shadow-2xl shadow-sky-500/40 opacity-100"
              : "scale-100 opacity-70 hover:opacity-100 shadow-md shadow-black/25 hover:scale-105"
          }`}
        >
          <IosMailIcon className="w-full h-full drop-shadow-md" />
          {activeChannel === "email" && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-red-500 shadow-md ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-75 duration-300">
              1
            </span>
          )}
        </button>
      </div>
    </>
  );
}
