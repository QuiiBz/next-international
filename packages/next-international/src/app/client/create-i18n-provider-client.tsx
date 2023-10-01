import React, { Context, ReactNode, Suspense, cache, use, useMemo } from 'react';
import type { BaseLocale, ImportedLocales } from 'international-types';

import type { LocaleContext } from '../../types';
import { flattenLocale } from '../../common/flatten-locale';

type I18nProviderProps = Omit<I18nProviderWrapperProps, 'fallback'>;

type I18nProviderWrapperProps = {
  fallback?: ReactNode;
  children: ReactNode;
};

export function createI18nProviderClient<Locale extends BaseLocale, LocalesKeys>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
  useCurrentLocale: () => LocalesKeys,
  fallbackLocale?: Record<string, unknown>,
) {
  const loadCachedLocale = cache((locale: LocalesKeys) => locales[locale as keyof typeof locales]());
  const loadLocale = (locale: LocalesKeys) => {
    try {
      return loadCachedLocale(locale);
    } catch (_) {
      return locales[locale as keyof typeof locales]();
    }
  };

  function I18nProvider({ children }: I18nProviderProps) {
    const locale = useCurrentLocale();
    const { default: clientLocale } = use(loadLocale(locale));

    const value = useMemo(
      () => ({
        localeContent: flattenLocale<Locale>(clientLocale),
        fallbackLocale: fallbackLocale ? flattenLocale<Locale>(fallbackLocale) : undefined,
        locale: locale as string,
      }),
      [clientLocale, locale],
    );

    return <I18nClientContext.Provider value={value}>{children}</I18nClientContext.Provider>;
  }

  return function I18nProviderWrapper({ fallback, children }: I18nProviderWrapperProps) {
    return (
      <Suspense fallback={fallback}>
        <I18nProvider>{children}</I18nProvider>
      </Suspense>
    );
  };
}
