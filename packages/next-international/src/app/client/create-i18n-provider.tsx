import React, { Context, ReactElement, ReactNode, useCallback, useEffect, useState } from 'react';
import type { LocaleContext } from '../../types';
import type { BaseLocale, ImportedLocales } from 'international-types';

type I18nProviderProps<Locale extends BaseLocale> = {
  locale: string;
  fallback?: ReactElement | null;
  fallbackLocale?: Locale;
  children: ReactNode;
};

export function createI18nProvider<Locale extends BaseLocale>(
  I18nContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
) {
  return function I18nAppProvider({
    locale: baseLocale,
    fallback = null,
    fallbackLocale,
    children,
  }: I18nProviderProps<Locale>) {
    const [clientLocale, setClientLocale] = useState<Locale>();

    const loadLocale = useCallback((locale: string) => {
      locales[locale]().then(content => {
        setClientLocale(content.default as Locale);
      });
    }, []);

    useEffect(() => {
      loadLocale(baseLocale);
    }, [baseLocale, loadLocale]);

    if (!clientLocale && fallback) {
      return fallback;
    }

    return (
      <I18nContext.Provider
        value={{
          localeContent: (clientLocale || baseLocale) as Locale,
          fallbackLocale,
        }}
      >
        {children}
      </I18nContext.Provider>
    );
  };
}
