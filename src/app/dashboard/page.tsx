"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FormattedMessage } from "react-intl";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VehicleCard } from "@/components/dashboard/VehicleCard";
import { ChannelSelector } from "@/components/dashboard/ChannelSelector";
import { PostNLTracker } from "@/components/dashboard/PostNLTracker";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { useUserData } from "@/lib/useUserData";
import { User } from "lucide-react";

// Code Splitting: Lazy-load dialogs only when opened by user interaction
const StripePortalModal = dynamic(
  () =>
    import("@/components/dashboard/StripePortalModal").then(
      (m) => m.StripePortalModal
    ),
  { ssr: false }
);

const ReplacementModal = dynamic(
  () =>
    import("@/components/dashboard/ReplacementModal").then(
      (m) => m.ReplacementModal
    ),
  { ssr: false }
);

export default function DashboardPage() {
  const { data } = useUserData();
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const [replacementModalOpen, setReplacementModalOpen] = useState(false);

  return (
    <>
      <Navbar />

      <main className="flex-1 py-10 md:py-14 bg-slate-50 dark:bg-[#0B1117] transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <FormattedMessage id="dashboard.portalTag" />
              </span>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                {data.fullName ? (
                  <FormattedMessage
                    id="dashboard.welcomeUser"
                    values={{ name: data.fullName.split(" ")[0] }}
                  />
                ) : (
                  <FormattedMessage id="dashboard.welcome" />
                )}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                <FormattedMessage id="dashboard.subtitle" />
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              <User className="w-4 h-4 text-emerald-500" />
              <span>{data.email}</span>
            </div>
          </div>

          {/* 1. Vehicle & Active Sticker Card */}
          <VehicleCard onOrderReplacement={() => setReplacementModalOpen(true)} />

          {/* 2. Strict 1-Channel Selector (WhatsApp / SMS / Email) */}
          <ChannelSelector />

          {/* 3. PostNL Letterbox Parcel Tracker */}
          <PostNLTracker />

          {/* 4. Subscription & Stripe Billing Card */}
          <SubscriptionCard onOpenStripePortal={() => setStripeModalOpen(true)} />
        </div>
      </main>

      {/* Stripe Customer Portal Modal */}
      <StripePortalModal
        isOpen={stripeModalOpen}
        onClose={() => setStripeModalOpen(false)}
      />

      {/* Replacement Sticker Order Modal (€5) */}
      <ReplacementModal
        isOpen={replacementModalOpen}
        onClose={() => setReplacementModalOpen(false)}
      />

      <Footer />
    </>
  );
}
