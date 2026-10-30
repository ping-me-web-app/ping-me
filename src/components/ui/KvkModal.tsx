"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { useIntl } from "react-intl";
import { Building2, ShieldCheck, Mail, MapPin, CreditCard } from "lucide-react";

interface KvkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KvkModal({ isOpen, onClose }: KvkModalProps) {
  const intl = useIntl();
  const isNl = intl.locale === "nl";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNl ? "Bedrijfsgegevens (KVK)" : "Company Details (Chamber of Commerce)"}
      description={
        isNl
          ? "Officiële registratie en handelsgegevens in Nederland."
          : "Official registration and corporate identity in the Netherlands."
      }
      maxWidth="md"
    >
      <div className="space-y-4 py-2 text-sm text-slate-700 dark:text-slate-300">
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isNl ? "Handelsnaam & Vennootschap" : "Trade Name & Entity"}
              </p>
              <p className="font-bold text-slate-900 dark:text-white">Ping Me</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isNl ? "KVK-nummer (Handelsregister)" : "Chamber of Commerce (KvK) Reg."}
              </p>
              <p className="font-mono font-bold text-slate-900 dark:text-white">89240182</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isNl ? "Vestiging" : "Jurisdiction"}
              </p>
              <p className="font-medium text-slate-900 dark:text-white">Amsterdam, Nederland 🇳🇱</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isNl ? "Klantenservice & Privacy Officer" : "Customer Support & DPO"}
              </p>
              <a
                href="mailto:support@pingme.app"
                className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                support@pingme.app
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isNl ? "Betalingsdienstaanbieder" : "Licensed Payment Processor"}
              </p>
              <p className="font-medium text-slate-900 dark:text-white">
                Stripe Payments Netherlands B.V. (iDEAL, Bancontact, SEPA)
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center pt-1">
          {isNl
            ? "100% AVG-proof en geregistreerd onder het toezicht van de Autoriteit Persoonsgegevens."
            : "Fully GDPR-compliant under Dutch data protection regulations."}
        </p>
      </div>
    </Modal>
  );
}
