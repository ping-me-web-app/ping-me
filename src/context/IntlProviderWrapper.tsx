"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { IntlProvider } from "react-intl";
import enMessages from "@/messages/en.json";
import nlMessages from "@/messages/nl.json";

export type Locale = "en" | "nl";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function flattenMessages(nestedMessages: any, prefix = ""): Record<string, string> {
  if (!nestedMessages) return {};
  return Object.keys(nestedMessages).reduce((messages: Record<string, string>, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }
    return messages;
  }, {});
}

const messageCatalogs: Record<Locale, Record<string, string>> = {
  en: flattenMessages(enMessages),
  nl: flattenMessages(nlMessages),
};

export function IntlProviderWrapper({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("nl");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pingme-locale") as Locale | null;
    if (saved === "nl" || saved === "en") {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    } else {
      setLocaleState("nl");
      document.documentElement.lang = "nl";
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("pingme-locale", newLocale);
    document.documentElement.lang = newLocale;
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "nl" : "en");
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      <IntlProvider
        locale={locale}
        defaultLocale="nl"
        messages={messageCatalogs[locale]}
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within an IntlProviderWrapper");
  }
  return context;
}
