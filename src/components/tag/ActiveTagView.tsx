"use client";

import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@/components/ui/Button";
import { SuccessState } from "@/components/ui/SuccessState";
import { AlertPresetPicker } from "@/components/common/AlertPresetPicker";
import { Car, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActiveTagViewProps {
  token?: string;
  isEmbedded?: boolean;
  className?: string;
  onSent?: (data: { preset: string; note: string; phone?: string; email?: string }) => void;
}

export function ActiveTagView({
  token = "PM-NL-8924",
  isEmbedded = false,
  className,
  onSent,
}: ActiveTagViewProps) {
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("p1");
  const [customText, setCustomText] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    onSent?.({
      preset: selectedPresetKey,
      note: customText,
      phone: senderPhone,
      email: senderEmail,
    });
  };

  return (
    <div
      className={cn(
        "w-full transition-colors",
        isEmbedded
          ? "p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-sm my-2"
          : "rounded-3xl bg-white dark:bg-[#0F172A] border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden p-5 sm:p-7",
        className
      )}
    >
      {/* 1. Refined Hero Vehicle Identity Header */}
      <div className="pb-4 sm:pb-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col items-center text-center space-y-3">
        {/* Status Badges Row */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <FormattedMessage id="tag.ownerReachable" />
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80">
            <Check className="w-3 h-3 text-emerald-500 stroke-[2.5]" />
            <FormattedMessage id="tag.rdwVerified" />
          </span>
        </div>

        {/* Hero Authentic Dutch Yellow License Plate */}
        <div className="inline-flex items-center rounded-xl bg-[#FFD700] border-2 border-black shadow-md shadow-amber-500/10 overflow-hidden font-mono font-black text-xl sm:text-2xl tracking-wider select-none text-black">
          <div className="bg-[#003399] text-white px-2.5 py-1.5 flex flex-col items-center justify-center text-[9px] leading-tight font-sans self-stretch">
            <span className="text-[8px] leading-none text-yellow-300">★</span>
            <span className="font-bold text-[10px] tracking-normal">NL</span>
          </div>
          <div className="px-5 py-1.5 tracking-widest uppercase font-black">
            K-123-XX
          </div>
        </div>

        {/* Vehicle Model & Color */}
        <div className="space-y-0.5">
          <h2 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
            <Car className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <span><FormattedMessage id="tag.vehicleTitle" /></span>
            <span className="text-slate-400 font-normal text-xs sm:text-sm">
              • <FormattedMessage id="tag.vehicleColor" />
            </span>
          </h2>
        </div>
      </div>

      {/* 2. Interactive Form or Success State */}
      {sent ? (
        <div className="py-8">
          <SuccessState
            size="md"
            title={<FormattedMessage id="tag.sentTitle" />}
            description={<FormattedMessage id="tag.sentDesc" values={{ plate: "K-123-XX" }} />}
            actionButton={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSent(false)}
                className="mt-2 text-xs rounded-xl"
              >
                <FormattedMessage id="tag.newMsgBtn" />
              </Button>
            }
          />
        </div>
      ) : (
        <div className="pt-4 sm:pt-5 space-y-3.5 sm:space-y-4">
          {/* Action Section Title */}
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              <FormattedMessage id="tag.formTitle" />
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <FormattedMessage id="tag.formSubtitle" />
            </p>
          </div>

          <AlertPresetPicker
            selectedPresetKey={selectedPresetKey}
            onSelectPreset={setSelectedPresetKey}
            customNote={customText}
            onCustomNoteChange={setCustomText}
            senderPhone={senderPhone}
            onSenderPhoneChange={setSenderPhone}
            senderEmail={senderEmail}
            onSenderEmailChange={setSenderEmail}
            showContactFields={true}
            onSubmit={handleSubmit}
            presetLabelId="tag.whatHappened"
            customNoteLabelId="tag.extraDetails"
            placeholderId="tag.extraPlaceholder"
            submitButtonId="tag.sendAlertBtn"
            accentColor="emerald"
            buttonSize="lg"
            buttonClassName="h-12 rounded-2xl font-bold shadow-lg shadow-emerald-600/25 text-sm"
          />

          <p className="text-center text-[11px] text-slate-400 leading-tight pt-1">
            <FormattedMessage id="tag.ownerProtectedNote" />
          </p>
        </div>
      )}
    </div>
  );
}

// Standalone component alias for reusability across both pages
export const TagAlertForm = ActiveTagView;
