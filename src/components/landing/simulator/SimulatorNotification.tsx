"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { CheckCircle2 } from "lucide-react";
import {
  IosWhatsAppIcon,
  IosMessagesIcon,
  IosMailIcon,
} from "@/components/icons/channel-icons";
import { ChannelType } from "@/types";

interface SimulatorNotificationProps {
  channel: ChannelType;
  animKey: number;
}

export function SimulatorNotification({ channel, animKey }: SimulatorNotificationProps) {
  return (
    <div key={animKey} className="animate-ios-notification-pop">
      {/* WHATSAPP VIEW */}
      {channel === "whatsapp" && (
        <div className="rounded-2xl bg-black/65 backdrop-blur-2xl border border-white/20 p-3 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                <IosWhatsAppIcon className="w-full h-full" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-white">
                    <FormattedMessage id="hero.simNotificationHeader" />
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                </div>
                <span className="text-[9px] text-emerald-400 font-medium">
                  <FormattedMessage id="hero.simVerifiedBadge" />
                </span>
              </div>
            </div>
            <span className="text-[9px] text-white/70 font-semibold px-1.5 py-0.5 rounded bg-white/10">
              <FormattedMessage id="hero.simNotificationTime" />
            </span>
          </div>

          <p className="text-[11px] font-semibold text-white/95 mb-1">
            🚗 <FormattedMessage id="hero.simNotificationPlate" values={{ plate: "K-123-XX" }} />
          </p>

          <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/20 p-2 text-[11px] text-slate-100 leading-snug shadow-inner">
            <FormattedMessage id="hero.simNotificationMsg" />
          </div>
        </div>
      )}

      {/* SMS VIEW */}
      {channel === "sms" && (
        <div className="rounded-2xl bg-black/65 backdrop-blur-2xl border border-white/20 p-3 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                <IosMessagesIcon className="w-full h-full" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-white">
                  <FormattedMessage id="hero.simSmsFrom" />
                </span>
                <p className="text-[9px] text-green-400 font-medium">
                  <FormattedMessage id="hero.simDirectRelay" />
                </p>
              </div>
            </div>
            <span className="text-[9px] text-white/70 font-semibold px-1.5 py-0.5 rounded bg-white/10">
              <FormattedMessage id="hero.simNotificationTime" />
            </span>
          </div>

          <p className="text-[11px] font-semibold text-white/95 mb-1">
            🚗 <FormattedMessage id="hero.simNotificationPlate" values={{ plate: "K-123-XX" }} />
          </p>

          <div className="rounded-xl bg-green-950/40 border border-green-500/20 p-2 text-[11px] text-slate-100 leading-snug font-sans shadow-inner">
            <FormattedMessage id="hero.simSmsMsg" />
          </div>
        </div>
      )}

      {/* EMAIL VIEW */}
      {channel === "email" && (
        <div className="rounded-2xl bg-black/65 backdrop-blur-2xl border border-white/20 p-3 shadow-2xl ring-1 ring-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                <IosMailIcon className="w-full h-full" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-white">
                  <FormattedMessage id="hero.simEmailSubject" values={{ plate: "K-123-XX" }} />
                </span>
                <p className="text-[9px] text-sky-300 font-medium">
                  <FormattedMessage id="hero.simEmailFrom" />
                </p>
              </div>
            </div>
            <span className="text-[9px] text-white/70 font-semibold px-1.5 py-0.5 rounded bg-white/10">
              <FormattedMessage id="hero.simNotificationTime" />
            </span>
          </div>

          <div className="rounded-xl bg-sky-950/40 border border-sky-500/20 p-2 text-[11px] text-slate-100 leading-snug font-sans shadow-inner">
            <FormattedMessage id="hero.simEmailMsg" />
          </div>
        </div>
      )}
    </div>
  );
}
