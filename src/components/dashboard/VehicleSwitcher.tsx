"use client";

import React from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { UserVehicleData } from "@/lib/useUserData";
import { Car, Plus, ShieldCheck, Check } from "lucide-react";

interface VehicleSwitcherProps {
  vehicles: UserVehicleData[];
  activeIndex: number;
  onSelectVehicle: (index: number) => void;
}

export function VehicleSwitcher({
  vehicles,
  activeIndex,
  onSelectVehicle,
}: VehicleSwitcherProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-500" />
            <FormattedMessage id="dashboard.yourVehicles" />
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <FormattedMessage
              id="dashboard.vehiclesCount"
              values={{ count: vehicles.length }}
            />
          </span>
        </div>

        {vehicles.length > 1 && (
          <span className="text-xs text-slate-400 hidden sm:inline-block">
            <FormattedMessage
              id="dashboard.managingMultiple"
              values={{ count: vehicles.length }}
            />
          </span>
        )}
      </div>

      {/* Horizontal Scrollable Vehicle Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {vehicles.map((v, idx) => {
          const isActive = idx === activeIndex;
          const years = v.durationYears || 2;

          return (
            <button
              key={v.id || v.token || v.plate || idx}
              type="button"
              onClick={() => onSelectVehicle(idx)}
              className={`group flex items-center gap-3 p-3 rounded-2xl border text-left shrink-0 transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/5"
                  : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
              }`}
            >
              {/* Mini Dutch Yellow Plate */}
              <div
                className={`inline-flex items-center rounded-md bg-[#FFD700] border shadow-xs overflow-hidden font-mono font-black text-xs select-none text-black h-7 transition-all ${
                  isActive ? "border-black ring-1 ring-black/20" : "border-black/70 opacity-90"
                }`}
              >
                <div className="bg-[#003399] text-white px-1 h-full flex flex-col items-center justify-center text-[7px] leading-tight font-sans">
                  <span>NL</span>
                </div>
                <div className="px-2 py-0.5 tracking-wider font-extrabold text-[11px]">
                  {v.plate}
                </div>
              </div>

              {/* Vehicle info & pass label */}
              <div className="pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    {v.make} {v.model || ""}
                  </span>
                  {isActive && (
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {years} Jr Pas
                  </span>
                  <span>•</span>
                  <span className="font-mono">{v.token}</span>
                </div>
              </div>
            </button>
          );
        })}

        {/* Add Another Vehicle CTA button */}
        <Link
          href="/order?add_vehicle=true"
          className="flex items-center gap-2 p-3 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 shrink-0 transition-all text-xs font-bold"
        >
          <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-emerald-500">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span>
            <FormattedMessage id="dashboard.addVehicleBtn" />
          </span>
        </Link>
      </div>
    </div>
  );
}
