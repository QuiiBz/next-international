import React, { Context, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { BaseLocale, ImportedLocales } from 'international-types';

import { flattenLocale } from '../../common/flatten-locale';
import type { LocaleContext } from '../../types';

type I18nProviderProps = {
  locale: string;
  resource?: Record<string, unknown>;
  fallback?: ReactElement | null;
  fallbackLocale?: Record<string, unknown>;
  children: ReactNode;
};

export function createI18nProviderClient<Locale extends BaseLocale, LocalesKeys>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
  useCurrentLocale: () => LocalesKeys,
) {
  return function I18nProviderClient({
    locale: baseLocale,
    resource,
    fallback = null,
    fallbackLocale,
    children,
  }: I18nProviderProps) {
    const locale = useCurrentLocale();
    const [clientLocale, setClientLocale] = useState<Locale | undefined>(
      resource ? flattenLocale<Locale>(resource) : undefined,
    );
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
        locale: locale as string,
      }),
      [clientLocale, baseLocale, fallbackLocale, locale],
    );

    if (!clientLocale && fallback) {
      return fallback;
    }

    return <I18nClientContext.Provider value={value}>{children}</I18nClientContext.Provider>;
  };
}
