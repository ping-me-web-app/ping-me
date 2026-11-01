"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { KvkModal } from "@/components/ui/KvkModal";
import { useAuth } from "@/lib/useAuth";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";

export function Footer() {
  const { isLoggedIn, mounted } = useAuth();
  const loggedIn = mounted && isLoggedIn;
  const [kvkOpen, setKvkOpen] = useState(false);

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A11] text-slate-600 dark:text-slate-400 text-sm transition-colors">
      {/* Dutch Trust strip */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 py-5 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
            <div className="flex items-center gap-3.5 p-3.5 sm:p-0 rounded-2xl bg-white dark:bg-slate-900/60 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/80 dark:border-slate-800/80 sm:border-0 shadow-xs sm:shadow-none text-left">
              <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  <FormattedMessage id="footer.postnlTitle" />
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  <FormattedMessage id="footer.postnlDesc" />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 sm:p-0 rounded-2xl bg-white dark:bg-slate-900/60 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/80 dark:border-slate-800/80 sm:border-0 shadow-xs sm:shadow-none text-left">
              <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  <FormattedMessage id="footer.idealTitle" />
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  <FormattedMessage id="footer.idealDesc" />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 sm:p-0 rounded-2xl bg-white dark:bg-slate-900/60 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/80 dark:border-slate-800/80 sm:border-0 shadow-xs sm:shadow-none text-left">
              <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  <FormattedMessage id="footer.gdprTitle" />
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  <FormattedMessage id="footer.gdprDesc" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3 pb-6 md:pb-0 border-b md:border-b-0 border-slate-200/60 dark:border-slate-800/60 text-center md:text-left flex flex-col items-center md:items-start">
            <BrandLogo size="md" />
            <p className="text-xs sm:text-sm max-w-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              <FormattedMessage id="footer.aboutText" />
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400">
              <FormattedMessage id="footer.madeFor" />
            </p>
          </div>

          {/* Links menu (3 clean columns on mobile & desktop) */}
          <div className="grid grid-cols-3 md:contents gap-4 sm:gap-6 text-left">
            <div>
              <h4 className="font-display font-bold text-slate-900 dark:text-white mb-2.5 sm:mb-3 text-xs sm:text-sm">
                <FormattedMessage id="footer.product" />
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link href="/#hoe-het-werkt" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><FormattedMessage id="nav.howItWorks" /></Link></li>
                <li><Link href="/#prijzen" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><FormattedMessage id="nav.pricing" /></Link></li>
                <li><Link href="/#voordelen" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><FormattedMessage id="nav.benefits" /></Link></li>
                <li><Link href="/tag/PM-NL-8924" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><FormattedMessage id="footer.qrDemo" /></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-slate-900 dark:text-white mb-2.5 sm:mb-3 text-xs sm:text-sm">
                <FormattedMessage id="footer.support" />
              </h4>
              <ul className="space-y-2 text-xs">
                {loggedIn ? (
                  <li><Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold text-emerald-600 dark:text-emerald-400 transition-colors"><FormattedMessage id="common.myDashboard" /></Link></li>
                ) : (
                  <li><Link href="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><FormattedMessage id="common.login" /></Link></li>
                )}
                <li><Link href="/#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><FormattedMessage id="nav.faq" /></Link></li>
                <li><a href="mailto:support@pingme.app" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"><FormattedMessage id="footer.contactSupport" /></a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-slate-900 dark:text-white mb-2.5 sm:mb-3 text-xs sm:text-sm">
                <FormattedMessage id="footer.legal" />
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    <FormattedMessage id="footer.privacy" />
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    <FormattedMessage id="footer.terms" />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setKvkOpen(true)}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 text-left cursor-pointer transition-colors"
                  >
                    <FormattedMessage id="footer.kvk" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 sm:gap-4 text-center sm:text-left">
          <p><FormattedMessage id="footer.copyright" values={{ year: new Date().getFullYear() }} /></p>
          <p><FormattedMessage id="footer.stripeProcessed" /></p>
        </div>
      </div>

      {/* KvK Chamber of Commerce Details Modal */}
      <KvkModal isOpen={kvkOpen} onClose={() => setKvkOpen(false)} />
    </footer>
  );
}
