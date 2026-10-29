"use client";

import React from "react";
import { FormattedMessage } from "react-intl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useUserData } from "@/lib/useUserData";
import { CreditCard, ExternalLink, Calendar, CheckCircle } from "lucide-react";

interface SubscriptionCardProps {
  onOpenStripePortal: () => void;
}

export function SubscriptionCard({ onOpenStripePortal }: SubscriptionCardProps) {
  const { data } = useUserData();

  // Calculate 1 year renewal date
  const createdDate = data.createdAt ? new Date(data.createdAt) : new Date();
  const renewalDate = new Date(createdDate);
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);

  const renewalFormatted = renewalDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paymentDisplay =
    data.paymentMethod === "ideal"
      ? `iDEAL (${data.selectedBank || "Bank"})`
      : data.paymentMethod === "apple_pay"
      ? "Apple Pay"
      : "Creditcard";
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              <FormattedMessage id="dashboard.subTitle" />
            </h3>
            <Badge variant="brand">
              <FormattedMessage id="dashboard.activeMembership" />
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            <FormattedMessage id="modals.stripeBadge" />
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onOpenStripePortal} className="text-xs">
          <CreditCard className="w-3.5 h-3.5 mr-1.5" />
          <FormattedMessage id="dashboard.stripeBtn" />
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            <FormattedMessage id="dashboard.currentRate" />
          </span>
          <p className="font-display font-extrabold text-2xl text-slate-900 dark:text-white mt-1">
            €10
            <span className="text-xs font-normal text-slate-400">
              <FormattedMessage id="pricing.mainInterval" />
            </span>
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold inline-flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3" />
            <FormattedMessage id="dashboard.firstStickerInc" />
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            <FormattedMessage id="dashboard.nextRenewal" />
          </span>
          <p className="font-display font-bold text-base text-slate-900 dark:text-white mt-1 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-sky-500" />
            <span>{renewalFormatted}</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            <FormattedMessage id="dashboard.sepaNote" />
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">
            <FormattedMessage id="dashboard.paymentMethod" />
          </span>
          <p className="font-display font-bold text-base text-slate-900 dark:text-white mt-1">
            {paymentDisplay}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Automatische SEPA-incasso jaarlijks
          </p>
        </div>
      </div>
    </div>
  );
}
