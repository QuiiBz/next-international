import React, { Context, ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { BaseLocale, ImportedLocales } from 'international-types';

import type { I18nProviderConfig, LocaleContext } from '../../types';
import { flattenLocale } from '../../common/flatten-locale';

type I18nProviderProps = {
  locale: string;
  fallback?: ReactElement | null;
  fallbackLocale?: Record<string, unknown>;
  config?: I18nProviderConfig;
  children: ReactNode;
};

export function createI18nProviderClient<Locale extends BaseLocale, LocalesKeys>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
  useCurrentLocale: (config?: I18nProviderConfig) => LocalesKeys,
) {
  return function I18nProviderClient({
    locale: baseLocale,
    fallback = null,
    fallbackLocale,
    children,
    config,
  }: I18nProviderProps) {
    const locale = useCurrentLocale(config);
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
