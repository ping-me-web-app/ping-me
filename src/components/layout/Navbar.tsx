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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-[#0B1117]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
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

          {/* Right Action Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Switcher */}
            <LanguageToggle />

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              {theme === "light" ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Action Button: Log In OR Dashboard */}
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
                <Button
                  href="/dashboard"
                  variant="primary"
                  className="h-10 px-4 rounded-xl shadow-sky-500/20 font-semibold text-xs"
                >
                  <FormattedMessage id="common.dashboard" />
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              )
            ) : (
              <Button
                href="/login"
                variant="primary"
                className="h-10 px-4 rounded-xl shadow-sky-500/20 font-semibold text-xs"
              >
                <User className="w-4 h-4 mr-1.5" />
                <FormattedMessage id="common.login" />
              </Button>
            )}
          </div>

          {/* Mobile Header Actions - Clean & Uncluttered */}
          <div className="flex md:hidden items-center gap-2">
            {!isHomePage && (
              <>
                <LanguageToggle size="sm" />
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>
              </>
            )}

            {/* Direct Mobile Header Login / Dashboard Pill */}
            {mounted && (
              isLoggedIn ? (
                isDashboardPage ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="h-9 px-2.5 rounded-xl font-semibold text-xs border-slate-200 dark:border-slate-700 text-rose-600 dark:text-rose-400"
                    aria-label="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-1" />
                    <span>Uit</span>
                  </Button>
                ) : (
                  <Button
                    href="/dashboard"
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 rounded-xl font-semibold text-xs border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400"
                    aria-label="Dashboard"
                  >
                    <User className="w-3.5 h-3.5 mr-1" />
                    <span>App</span>
                  </Button>
                )
              ) : (
                <Button
                  href="/login"
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 rounded-xl font-semibold text-xs border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                  aria-label="Inloggen"
                >
                  <User className="w-3.5 h-3.5 mr-1 text-slate-500" />
                  <FormattedMessage id="common.login" />
                </Button>
              )
            )}

            {isHomePage && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
                className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown - Only available on Home Page */}
      {isHomePage && mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1117]/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/#hoe-het-werkt"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
            >
              <FormattedMessage id="nav.howItWorks" />
            </Link>
            <Link
              href="/#voordelen"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
            >
              <FormattedMessage id="nav.benefits" />
            </Link>
            <Link
              href="/#prijzen"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
            >
              <FormattedMessage id="nav.pricing" />
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors"
            >
              <FormattedMessage id="nav.faq" />
            </Link>
          </nav>

          {/* Preferences Row: Language & Theme Switcher */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                <FormattedMessage id="nav.languageLabel" defaultMessage="Taal" />:
              </span>
              <LanguageToggle size="sm" />
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <FormattedMessage id="nav.themeDark" defaultMessage="Donker" />
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <FormattedMessage id="nav.themeLight" defaultMessage="Licht" />
                </>
              )}
            </button>
          </div>

          {/* Quick CTA Actions inside Mobile Drawer */}
          <div className="pt-2 space-y-2">
            <Button
              href="/order"
              variant="primary"
              size="md"
              className="w-full shadow-md shadow-emerald-600/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FormattedMessage id="hero.ctaPrimary" defaultMessage="Bestel Sticker (€10/jr)" />
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            {isLoggedIn ? (
              <Button
                href="/dashboard"
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FormattedMessage id="common.myDashboard" />
              </Button>
            ) : (
              <Button
                href="/login"
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="w-4 h-4 mr-1.5" />
                <FormattedMessage id="common.login" />
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
