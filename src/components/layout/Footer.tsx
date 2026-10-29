"use client";

import React from "react";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A11] text-slate-600 dark:text-slate-400 text-sm transition-colors">
      {/* Dutch Trust strip */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  <FormattedMessage id="footer.postnlTitle" />
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <FormattedMessage id="footer.postnlDesc" />
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  <FormattedMessage id="footer.idealTitle" />
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <FormattedMessage id="footer.idealDesc" />
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  <FormattedMessage id="footer.gdprTitle" />
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <FormattedMessage id="footer.gdprDesc" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <BrandLogo size="md" />
            <p className="text-sm max-w-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              <FormattedMessage id="footer.aboutText" />
            </p>
            <p className="text-xs text-slate-400">
              <FormattedMessage id="footer.madeFor" />
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white mb-3 text-sm">
              <FormattedMessage id="footer.product" />
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/#hoe-het-werkt" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="nav.howItWorks" /></Link></li>
              <li><Link href="/#prijzen" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="nav.pricing" /></Link></li>
              <li><Link href="/#voordelen" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="nav.benefits" /></Link></li>
              <li><Link href="/tag/PM-NL-8924" className="hover:text-emerald-600 dark:hover:text-emerald-400">QR Demo</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white mb-3 text-sm">
              <FormattedMessage id="footer.support" />
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="common.login" /></Link></li>
              <li><Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="common.myDashboard" /></Link></li>
              <li><Link href="/#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="nav.faq" /></Link></li>
              <li><a href="mailto:support@pingme.app" className="hover:text-emerald-600 dark:hover:text-emerald-400">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-slate-900 dark:text-white mb-3 text-sm">
              <FormattedMessage id="footer.legal" />
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="footer.privacy" /></a></li>
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="footer.terms" /></a></li>
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400"><FormattedMessage id="footer.kvk" /></a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p><FormattedMessage id="footer.copyright" values={{ year: new Date().getFullYear() }} /></p>
          <p><FormattedMessage id="footer.stripeProcessed" /></p>
        </div>
      </div>
    </footer>
  );
}
