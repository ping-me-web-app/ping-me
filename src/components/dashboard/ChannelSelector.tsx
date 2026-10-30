"use client";

import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ChannelType } from "@/types";
import { Button } from "@/components/ui/Button";
import { useUserData } from "@/lib/useUserData";
import {
  IosWhatsAppIcon,
  IosMessagesIcon,
  IosMailIcon,
} from "@/components/icons/channel-icons";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export function ChannelSelector() {
  const intl = useIntl();
  const { data, updateData } = useUserData();
  const [selectedChannel, setSelectedChannel] = useState<ChannelType>(data.channel);
  const [phone, setPhone] = useState(data.phone);
  const [email, setEmail] = useState(data.email);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSelectedChannel(data.channel);
    setPhone(data.phone);
    setEmail(data.email);
  }, [data]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateData({ channel: selectedChannel, phone, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const channelCards = [
    {
      id: "whatsapp" as const,
      nameId: "dashboard.whatsapp",
      badgeId: "dashboard.whatsappBadge",
      descId: "dashboard.whatsappDesc",
      icon: IosWhatsAppIcon,
    },
    {
      id: "sms" as const,
      nameId: "dashboard.sms",
      badgeId: "dashboard.smsBadge",
      descId: "dashboard.smsDesc",
      icon: IosMessagesIcon,
    },
    {
      id: "email" as const,
      nameId: "dashboard.email",
      badgeId: "dashboard.emailBadge",
      descId: "dashboard.emailDesc",
      icon: IosMailIcon,
    },
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <FormattedMessage id="dashboard.channelTitle" />
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <FormattedMessage id="dashboard.channelSubtitle" />
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 w-fit">
          <ShieldCheck className="w-3.5 h-3.5" />
          <FormattedMessage id="common.anonymous" />
        </div>
      </div>

      <form onSubmit={handleSave} className="pt-6 space-y-6">
        {/* Strict 1-Channel Radio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {channelCards.map((chan) => {
            const isSelected = selectedChannel === chan.id;
            const Icon = chan.icon;

            return (
              <div
                key={chan.id}
                onClick={() => setSelectedChannel(chan.id)}
                className={`relative cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-500/20"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0">
                    <Icon className="w-full h-full drop-shadow-sm" />
                  </div>
                  <input
                    type="radio"
                    name="channel"
                    checked={isSelected}
                    onChange={() => setSelectedChannel(chan.id)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                </div>
                <div className="mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      <FormattedMessage id={chan.nameId} />
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      <FormattedMessage id={chan.badgeId} />
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    <FormattedMessage id={chan.descId} />
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Input based on selected channel */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {selectedChannel === "whatsapp" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <FormattedMessage id="dashboard.whatsappLabel" />
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+31 6 12345678"
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <FormattedMessage id="dashboard.whatsappHelper" />
              </p>
            </div>
          )}

          {selectedChannel === "sms" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <FormattedMessage id="dashboard.smsLabel" />
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+31 6 12345678"
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <FormattedMessage id="dashboard.smsHelper" />
              </p>
            </div>
          )}

          {selectedChannel === "email" && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <FormattedMessage id="dashboard.emailLabel" />
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={intl.formatMessage({ id: "login.emailPlaceholder" })}
                className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                <FormattedMessage id="dashboard.emailHelper" />
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {saved ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <FormattedMessage id="dashboard.savedMsg" />
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              <FormattedMessage id="dashboard.directEffect" />
            </span>
          )}

          <Button type="submit" size="sm" className="w-full sm:w-auto shrink-0 whitespace-nowrap">
            <FormattedMessage id="dashboard.saveButton" />
          </Button>
        </div>
      </form>
    </div>
  );
}
