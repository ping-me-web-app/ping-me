"use client";

import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

function getInitialTime(): string {
  if (typeof window === "undefined") return "";
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function getInitialDate(locale: string): string {
  if (typeof window === "undefined") return "";
  try {
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat(
      locale === "nl" ? "nl-NL" : "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    ).format(now);
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  } catch {
    return "";
  }
}

export function useLiveClock() {
  const intl = useIntl();
  const [timeStr, setTimeStr] = useState<string>(getInitialTime);
  const [dateStr, setDateStr] = useState<string>(() => getInitialDate(intl.locale));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateTimeAndDate = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setTimeStr(`${hours}:${minutes}`);

      try {
        const formattedDate = new Intl.DateTimeFormat(
          intl.locale === "nl" ? "nl-NL" : "en-US",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
          }
        ).format(now);
        setDateStr(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
      } catch {
        // preserve previous date if formatting fails
      }
    };

    updateTimeAndDate();
    const interval = setInterval(updateTimeAndDate, 1000);
    return () => clearInterval(interval);
  }, [intl.locale]);

  return { timeStr, dateStr, mounted };
}
