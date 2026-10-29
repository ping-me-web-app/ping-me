"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { useUserData } from "@/lib/useUserData";
import { Truck, CheckCircle2, Clock, Mailbox, ExternalLink, MapPin } from "lucide-react";

export function PostNLTracker() {
  const { data } = useUserData();
  const isCustomOrder = data.token !== "PM-NL-8924";

  const barcode = `3SPL${data.token.replace(/[^a-zA-Z0-9]/g, "")}NL`;

  const steps = isCustomOrder
    ? [
        {
          title: `Sticker voorgeprogrammeerd voor ${data.plate}`,
          time: "Vandaag • Zojuist geregistreerd",
          done: true,
          active: false,
        },
        {
          title: "Klaargemaakt voor PostNL verzending",
          time: "Vandaag • Wordt vandaag overgedragen",
          done: false,
          active: true,
        },
        {
          title: "Onderweg met PostNL postbode",
          time: "Verwacht: morgen tussen 09:00 - 18:00",
          done: false,
          active: false,
        },
        {
          title: "In je brievenbus bezorgd",
          time: "Binnen 1-2 werkdagen",
          done: false,
          active: false,
        },
      ]
    : [
        { titleId: "dashboard.step1", timeId: "dashboard.step1Time", done: true },
        { titleId: "dashboard.step2", timeId: "dashboard.step2Time", done: true },
        { titleId: "dashboard.step3", timeId: "dashboard.step3Time", done: true, active: true },
        { titleId: "dashboard.step4", timeId: "dashboard.step4Time", done: false },
      ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              <FormattedMessage id="dashboard.trackerTitle" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <FormattedMessage id="dashboard.barcodeLabel" />{" "}
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {barcode}
              </span>
            </p>
            {data.address && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-orange-500" />
                <span>
                  {data.fullName ? `${data.fullName} • ` : ""}
                  {data.address}
                </span>
              </p>
            )}
          </div>
        </div>

        <a
          href="https://postnl.nl"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          <FormattedMessage id="dashboard.viewPostnl" />
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="pt-6">
        {/* Step Progress Line */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {steps.map((st, i) => (
            <div key={i} className="flex flex-col items-start space-y-2">
              <div className="flex items-center gap-2">
                {st.done ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                )}
                <span
                  className={`text-xs font-bold ${
                    st.active
                      ? "text-orange-600 dark:text-orange-400"
                      : st.done
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400"
                  }`}
                >
                  <FormattedMessage id="dashboard.stepPrefix" values={{ step: i + 1 }} />
                </span>
              </div>
              <p className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">
                {"title" in st ? st.title : <FormattedMessage id={st.titleId} />}
              </p>
              <p className="text-[11px] text-slate-400">
                {"time" in st ? st.time : <FormattedMessage id={st.timeId} />}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
          <Mailbox className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <span>
            <FormattedMessage id="dashboard.mailboxTip" />
          </span>
        </div>
      </div>
    </div>
  );
}
