import type { PropsWithChildren } from "react";
import { createContext, use, useCallback, useMemo, useState } from "react";

import az from "@/i18n/messages/az.json";
import ru from "@/i18n/messages/ru.json";

export const supportedLocales = ["az", "ru"] as const;
export type Locale = (typeof supportedLocales)[number];
type MessageValues = Record<string, string | number>;

const messages = { az, ru } as const;
const storageKey = "qiymetleri.locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: MessageValues) => string;
  formatNumber: (value: number) => string;
  formatDate: (value: Date, options?: Intl.DateTimeFormatOptions) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return supportedLocales.some((locale) => locale === value);
}

function initialLocale(): Locale {
  try {
    const stored = globalThis.localStorage?.getItem(storageKey) ?? null;
    return isLocale(stored) ? stored : "az";
  } catch {
    return "az";
  }
}

function messageAt(locale: Locale, key: string): string {
  let value: unknown = messages[locale];
  for (const segment of key.split(".")) {
    if (!value || typeof value !== "object") return key;
    value = (value as Record<string, unknown>)[segment];
  }
  return typeof value === "string" ? value : key;
}

function formatMessage(
  template: string,
  values: MessageValues,
  numberFormat: Intl.NumberFormat,
): string {
  return template.replace(/\{(\w+)(?:,\s*(number))?\}/g, (match, key: string, kind?: string) => {
    const value = values[key];
    if (value === undefined) return match;
    return kind === "number" && typeof value === "number"
      ? numberFormat.format(value)
      : String(value);
  });
}

export function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const intlLocale = locale === "az" ? "az-AZ" : "ru-RU";
  const numberFormat = useMemo(() => new Intl.NumberFormat(intlLocale), [intlLocale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    try {
      globalThis.localStorage?.setItem(storageKey, nextLocale);
    } catch {
      // The in-memory language still changes if device storage is unavailable.
    }
  }, []);

  const t = useCallback(
    (key: string, values: MessageValues = {}) =>
      formatMessage(messageAt(locale, key), values, numberFormat),
    [locale, numberFormat],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      formatNumber: (number) => numberFormat.format(number),
      formatDate: (date, options) => new Intl.DateTimeFormat(intlLocale, options).format(date),
    }),
    [intlLocale, locale, numberFormat, setLocale, t],
  );

  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useLocale() {
  const context = use(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
