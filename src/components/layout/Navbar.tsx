"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FormattedMessage } from "react-intl";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useTheme } from "@/components/layout/ThemeProvider";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useAuth } from "@/lib/useAuth";
import { Sun, Moon, Menu, X, ArrowRight, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, mounted, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout("/");
  };

  const isDashboardPage = pathname?.startsWith("/dashboard");
  const isHomePage = pathname === "/";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-[#0B1117]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <BrandLogo size="md" />
          </div>

          {/* Desktop Navigation Links - Only displayed on Home Page */}
          {isHomePage && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Link href="/#hoe-het-werkt" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <FormattedMessage id="nav.howItWorks" />
              </Link>
              <Link href="/#voordelen" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <FormattedMessage id="nav.benefits" />
              </Link>
              <Link href="/#prijzen" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <FormattedMessage id="nav.pricing" />
              </Link>
              <Link href="/#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <FormattedMessage id="nav.faq" />
              </Link>
            </nav>
          )}

          {/* Right Action Buttons - All standardized to h-10 and rounded-xl */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Switcher (h-10) */}
            <LanguageToggle />

            {/* Theme Switcher Toggle (h-10 w-10) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Action Button: Log In OR Dashboard (never both) (h-10) */}
            {!mounted ? (
              <div className="h-10 w-24 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/60 dark:border-slate-800/60" />
            ) : isLoggedIn ? (
              isDashboardPage ? (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="h-10 px-4 rounded-xl font-semibold text-xs border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  <FormattedMessage id="common.logout" />
                </Button>
              ) : (
                <Link href="/dashboard">
                  <Button
                    variant="primary"
                    className="h-10 px-4 rounded-xl shadow-sky-500/20 font-semibold text-xs"
                  >
                    <FormattedMessage id="common.dashboard" />
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              )
            ) : (
              <Link href="/login">
                <Button
                  variant="primary"
                  className="h-10 px-4 rounded-xl shadow-sky-500/20 font-semibold text-xs"
                >
                  <User className="w-4 h-4 mr-1.5" />
                  <FormattedMessage id="common.login" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu toggle or direct actions on other pages */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {isHomePage ? (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="h-10 w-10 inline-flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            ) : (
              /* Non-home pages: render Logout or Login directly on mobile without any menu button */
              mounted && (
                isLoggedIn ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="h-10 px-3 rounded-xl font-semibold text-xs border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    <FormattedMessage id="common.logout" />
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button variant="primary" size="sm" className="h-10 px-3 rounded-xl font-semibold text-xs">
                      <User className="w-3.5 h-3.5 mr-1" />
                      <FormattedMessage id="common.login" />
                    </Button>
                  </Link>
                )
              )
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown - Only available on Home Page */}
      {isHomePage && mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1117] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/#hoe-het-werkt"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <FormattedMessage id="nav.howItWorks" />
          </Link>
          <Link
            href="/#voordelen"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <FormattedMessage id="nav.benefits" />
          </Link>
          <Link
            href="/#prijzen"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <FormattedMessage id="nav.pricing" />
          </Link>
          <Link
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <FormattedMessage id="nav.faq" />
          </Link>
          <div className="pt-3">
            {!mounted ? (
              <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/60 dark:border-slate-800/60" />
            ) : isLoggedIn ? (
              isDashboardPage ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-rose-600 dark:text-rose-400"
                >
                  <LogOut className="w-4 h-4 mr-1.5" />
                  <FormattedMessage id="common.logout" />
                </Button>
              ) : (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">
                    <FormattedMessage id="common.myDashboard" />
                  </Button>
                </Link>
              )
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  <User className="w-4 h-4 mr-1.5" />
                  <FormattedMessage id="common.login" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
