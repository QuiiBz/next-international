import React, { Context, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { LocaleContext } from '../../types';
import type { BaseLocale, ImportedLocales } from 'international-types';
import { flattenLocale } from '../../common/flatten-locale';

type I18nProviderProps = {
  locale: string;
  fallback?: ReactElement | null;
  fallbackLocale?: Record<string, unknown>;
  children: ReactNode;
};

export function createI18nProviderClient<Locale extends BaseLocale>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
) {
  return function I18nProviderClient({
    locale: baseLocale,
    fallback = null,
    fallbackLocale,
    children,
  }: I18nProviderProps) {
    const [clientLocale, setClientLocale] = useState<Locale>();

    const loadLocale = useCallback((locale: string) => {
      locales[locale]().then(content => {
        setClientLocale(flattenLocale<Locale>(content.default));
      });
    }, []);

    useEffect(() => {
      loadLocale(baseLocale);
    }, [baseLocale, loadLocale]);

    const value = useMemo(
      () => ({
        localeContent: (clientLocale || baseLocale) as Locale,
        fallbackLocale: fallbackLocale ? flattenLocale<Locale>(fallbackLocale) : undefined,
      }),
      [clientLocale, baseLocale, fallbackLocale],
    );

    if (!clientLocale && fallback) {
      return fallback;
    }

    return <I18nClientContext.Provider value={value}>{children}</I18nClientContext.Provider>;
  };
}
