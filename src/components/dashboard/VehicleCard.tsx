"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUserData } from "@/lib/useUserData";
import { Car, ExternalLink, QrCode, Edit2, Check, RefreshCw } from "lucide-react";

interface VehicleCardProps {
  onOrderReplacement: () => void;
}

export function VehicleCard({ onOrderReplacement }: VehicleCardProps) {
  const { data, updateData } = useUserData();
  const [plate, setPlate] = useState(data.plate);
  const [model, setModel] = useState(
    `${data.make} ${data.model} ${data.color ? `(${data.color})` : ""}`.trim()
  );
  const [token, setToken] = useState(data.token);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPlate(data.plate);
    setModel(
      `${data.make} ${data.model} ${data.color ? `(${data.color})` : ""}`.trim()
    );
    setToken(data.token);
  }, [data]);

  const handleSave = () => {
    setIsEditing(false);
    updateData({ plate, model });
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              <FormattedMessage id="dashboard.userVehicleTitle" />
            </h3>
            <Badge variant="success">
              <FormattedMessage id="dashboard.activeBadge" />
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Token: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{token}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/tag/${token}`} target="_blank">
            <Button variant="outline" size="sm" className="text-xs">
              <QrCode className="w-3.5 h-3.5 mr-1.5" />
              <FormattedMessage id="dashboard.testQr" />
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={onOrderReplacement} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            <FormattedMessage id="dashboard.repButton" />
          </Button>
        </div>
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Dutch License Plate Display */}
        <div className="flex flex-col items-start gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            <FormattedMessage id="dashboard.licensePlateLabel" />
          </span>
          <div className="inline-flex items-center rounded-lg bg-[#FFD700] border-2 border-black shadow-md overflow-hidden font-mono font-black text-xl tracking-wider select-none text-black">
            {/* EU blue band */}
            <div className="bg-[#003399] text-white px-2 py-2 flex flex-col items-center justify-center text-[10px] leading-tight font-sans">
              <span className="text-[9px]">★</span>
              <span className="font-bold">NL</span>
            </div>
            {/* Plate Number */}
            <div className="px-5 py-2 tracking-widest uppercase">
              {plate}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            <FormattedMessage id="dashboard.verifiedRdw" />
          </p>
        </div>

        {/* Vehicle Details & Edit Form */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <FormattedMessage id="dashboard.licensePlateLabel" />:
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <FormattedMessage id="dashboard.brandModel" />
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5"
                />
              </div>
              <Button size="sm" onClick={handleSave} className="w-full text-xs">
                <Check className="w-3.5 h-3.5 mr-1" />
                <FormattedMessage id="dashboard.saveChanges" />
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">
                  <FormattedMessage id="dashboard.vehicleInfo" />
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3 h-3" />
                  <FormattedMessage id="dashboard.edit" />
                </button>
              </div>
              <p className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-500" />
                {model}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                <FormattedMessage id="dashboard.helperText" />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
