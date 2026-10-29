"use client";

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ALERT_PRESETS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import {
  Send,
  Car,
  Lightbulb,
  Wind,
  BellRing,
  AlertTriangle,
  KeyRound,
  MessageSquarePlus,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_ICONS: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    accentBg: string;
    accentText: string;
    activeBorder: string;
    activeBg: string;
  }
> = {
  p1: {
    icon: Car,
    accentBg: "bg-emerald-500/15 dark:bg-emerald-500/25",
    accentText: "text-emerald-600 dark:text-emerald-400",
    activeBorder: "border-emerald-500 ring-2 ring-emerald-500/30",
    activeBg: "bg-emerald-50/90 dark:bg-emerald-950/40",
  },
  p2: {
    icon: Lightbulb,
    accentBg: "bg-amber-500/15 dark:bg-amber-500/25",
    accentText: "text-amber-600 dark:text-amber-400",
    activeBorder: "border-amber-500 ring-2 ring-amber-500/30",
    activeBg: "bg-amber-50/90 dark:bg-amber-950/40",
  },
  p3: {
    icon: Wind,
    accentBg: "bg-sky-500/15 dark:bg-sky-500/25",
    accentText: "text-sky-600 dark:text-sky-400",
    activeBorder: "border-sky-500 ring-2 ring-sky-500/30",
    activeBg: "bg-sky-50/90 dark:bg-sky-950/40",
  },
  p4: {
    icon: BellRing,
    accentBg: "bg-rose-500/15 dark:bg-rose-500/25",
    accentText: "text-rose-600 dark:text-rose-400",
    activeBorder: "border-rose-500 ring-2 ring-rose-500/30",
    activeBg: "bg-rose-50/90 dark:bg-rose-950/40",
  },
  p5: {
    icon: AlertTriangle,
    accentBg: "bg-orange-500/15 dark:bg-orange-500/25",
    accentText: "text-orange-600 dark:text-orange-400",
    activeBorder: "border-orange-500 ring-2 ring-orange-500/30",
    activeBg: "bg-orange-50/90 dark:bg-orange-950/40",
  },
  p6: {
    icon: KeyRound,
    accentBg: "bg-violet-500/15 dark:bg-violet-500/25",
    accentText: "text-violet-600 dark:text-violet-400",
    activeBorder: "border-violet-500 ring-2 ring-violet-500/30",
    activeBg: "bg-violet-50/90 dark:bg-violet-950/40",
  },
  p7: {
    icon: MessageSquarePlus,
    accentBg: "bg-teal-500/15 dark:bg-teal-500/25",
    accentText: "text-teal-600 dark:text-teal-400",
    activeBorder: "border-teal-500 ring-2 ring-teal-500/30",
    activeBg: "bg-teal-50/90 dark:bg-teal-950/40",
  },
};

interface AlertPresetPickerProps {
  selectedPresetKey: string;
  onSelectPreset: (key: string) => void;
  customNote: string;
  onCustomNoteChange: (text: string) => void;
  senderPhone?: string;
  onSenderPhoneChange?: (phone: string) => void;
  senderEmail?: string;
  onSenderEmailChange?: (email: string) => void;
  showContactFields?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  presetLabelId?: string;
  customNoteLabelId?: string;
  placeholderId?: string;
  submitButtonId?: string;
  accentColor?: "sky" | "emerald";
  buttonSize?: "md" | "lg";
  buttonClassName?: string;
  className?: string;
}

export function AlertPresetPicker({
  selectedPresetKey,
  onSelectPreset,
  customNote,
  onCustomNoteChange,
  senderPhone = "",
  onSenderPhoneChange,
  senderEmail = "",
  onSenderEmailChange,
  showContactFields = false,
  onSubmit,
  presetLabelId = "scannerDemo.presetLabel",
  customNoteLabelId = "scannerDemo.customNoteLabel",
  placeholderId = "scannerDemo.customNotePlaceholder",
  submitButtonId = "scannerDemo.sendButton",
  accentColor = "sky",
  buttonSize = "md",
  buttonClassName,
  className,
}: AlertPresetPickerProps) {
  const intl = useIntl();

  const focusRing =
    accentColor === "sky" ? "focus:ring-sky-500" : "focus:ring-emerald-500";

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4 sm:space-y-4", className)}>
      {/* Preset Buttons with Standout Icons */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
          <FormattedMessage id={presetLabelId} />
        </label>
        <div className="grid grid-cols-1 gap-2">
          {ALERT_PRESETS.map((preset) => {
            const config = PRESET_ICONS[preset.key] || PRESET_ICONS.p1;
            const Icon = config.icon;
            const isSelected = selectedPresetKey === preset.key;

            return (
              <button
                type="button"
                key={preset.key}
                onClick={() => onSelectPreset(preset.key)}
                className={cn(
                  "group relative flex items-center gap-2.5 text-left p-2.5 sm:p-2.5 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.98]",
                  isSelected
                    ? cn("shadow-xs font-semibold text-slate-900 dark:text-white", config.activeBorder, config.activeBg)
                    : "border-slate-200/90 dark:border-slate-800/90 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-900/50"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs",
                    config.accentBg,
                    config.accentText
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium leading-tight flex-1">
                  <FormattedMessage id={preset.id} />
                </span>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Details */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          <FormattedMessage id={customNoteLabelId} />
        </label>
        <textarea
          value={customNote}
          onChange={(e) => onCustomNoteChange(e.target.value)}
          placeholder={intl.formatMessage({ id: placeholderId })}
          rows={2}
          className={cn(
            "w-full text-sm sm:text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2",
            focusRing
          )}
        />
      </div>

      {/* Optional Sender Contact Fields */}
      {showContactFields && (
        <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/70 space-y-2.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              <FormattedMessage id="tag.contactOptionalTitle" />
            </label>
            <p className="text-[11px] text-slate-400 leading-tight">
              <FormattedMessage id="tag.contactOptionalDesc" />
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Optional Phone */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <input
                type="tel"
                value={senderPhone}
                onChange={(e) => onSenderPhoneChange?.(e.target.value)}
                placeholder={intl.formatMessage({ id: "tag.senderPhonePlaceholder" })}
                className={cn(
                  "w-full text-sm sm:text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-8 pr-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2",
                  focusRing
                )}
              />
            </div>

            {/* Optional Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => onSenderEmailChange?.(e.target.value)}
                placeholder={intl.formatMessage({ id: "tag.senderEmailPlaceholder" })}
                className={cn(
                  "w-full text-sm sm:text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-8 pr-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2",
                  focusRing
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* Primary Submit Button */}
      <Button
        type="submit"
        size={buttonSize}
        className={cn("w-full active:scale-[0.98] transition-transform", buttonClassName)}
      >
        <Send className="w-4 h-4 mr-2" />
        <FormattedMessage id={submitButtonId} />
      </Button>
    </form>
  );
}
