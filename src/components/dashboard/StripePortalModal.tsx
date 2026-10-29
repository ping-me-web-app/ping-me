"use client";

import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useUserData } from "@/lib/useUserData";
import { Download, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";

interface StripePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StripePortalModal({ isOpen, onClose }: StripePortalModalProps) {
  const intl = useIntl();
  const { data } = useUserData();
  const [subStatus, setSubStatus] = useState<"active" | "cancelled">("active");
  const [actionDone, setActionDone] = useState<string | null>(null);

  const createdDate = data.createdAt ? new Date(data.createdAt) : new Date();
  const renewalDate = new Date(createdDate);
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);

  const renewalFormatted = renewalDate.toLocaleDateString(
    intl.locale === "nl" ? "nl-NL" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const createdFormatted = createdDate.toLocaleDateString(
    intl.locale === "nl" ? "nl-NL" : "en-US",
    { day: "numeric", month: "short", year: "numeric" }
  );

  const paymentDisplay =
    data.paymentMethod === "ideal"
      ? `iDEAL (${data.selectedBank || "Bank"})`
      : data.paymentMethod === "apple_pay"
      ? "Apple Pay"
      : "Creditcard";

  const invoiceNumber = `INV-${createdDate.getFullYear()}-${
    data.token.replace(/\D/g, "") || "8924"
  }`;

  const handleCancelSub = () => {
    if (confirm(intl.formatMessage({ id: "modals.cancelPrompt" }))) {
      setSubStatus("cancelled");
      setActionDone(
        intl.formatMessage({ id: "modals.cancelSuccess" }, { date: renewalFormatted })
      );
    }
  };

  const handleDownloadInvoice = () => {
    setActionDone(
      intl.formatMessage({ id: "modals.invoiceSuccess" }, { number: invoiceNumber })
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={intl.formatMessage({ id: "modals.stripeTitle" })}
      description={intl.formatMessage({ id: "modals.stripeDesc" })}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Stripe branding badge */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#635BFF] text-base tracking-tighter">stripe</span>
            <span className="text-slate-600 dark:text-slate-300">
              <FormattedMessage id="modals.stripeBadge" />
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <FormattedMessage id="modals.encrypt" />
          </span>
        </div>

        {actionDone && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{actionDone}</span>
          </div>
        )}

        {/* Current plan status */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
              <FormattedMessage id="pricing.mainTitle" />
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              subStatus === "active"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
            }`}>
              {subStatus === "active" ? (
                <FormattedMessage id="modals.activeSubBadge" />
              ) : (
                <FormattedMessage id="modals.cancelledSubBadge" />
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subStatus === "active" ? (
              <FormattedMessage
                id="modals.activeSubDesc"
                values={{ date: renewalFormatted, method: paymentDisplay }}
              />
            ) : (
              <FormattedMessage
                id="modals.cancelledSubDesc"
                values={{ date: renewalFormatted }}
              />
            )}
          </p>
        </div>

        {/* Invoices list */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            <FormattedMessage id="modals.invoicesTitle" />
          </h4>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="p-3 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  <FormattedMessage id="modals.invName" values={{ number: invoiceNumber }} />
                </p>
                <p className="text-slate-400 text-[11px]">
                  <FormattedMessage
                    id="modals.invDesc"
                    values={{ date: createdFormatted, method: paymentDisplay }}
                  />
                </p>
              </div>
              <button
                onClick={handleDownloadInvoice}
                className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Download className="w-3.5 h-3.5" />
                <FormattedMessage id="modals.pdfBtn" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          {subStatus === "active" ? (
            <button
              onClick={handleCancelSub}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <FormattedMessage id="modals.cancelSub" />
            </button>
          ) : (
            <button
              onClick={() => {
                setSubStatus("active");
                setActionDone(intl.formatMessage({ id: "modals.resumeSuccess" }));
              }}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <FormattedMessage id="modals.resumeSub" />
            </button>
          )}

          <Button variant="secondary" size="sm" onClick={onClose}>
            <FormattedMessage id="modals.closeBtn" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
