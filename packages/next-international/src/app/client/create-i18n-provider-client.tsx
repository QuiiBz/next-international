import React, { Context, ReactNode, use, useMemo } from 'react';
import type { BaseLocale, ImportedLocales } from 'international-types';

import type { LocaleContext } from '../../types';
import { flattenLocale } from '../../common/flatten-locale';

type I18nProviderProps = {
  children: ReactNode;
};

export function createI18nProviderClient<Locale extends BaseLocale, LocalesKeys>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
  useCurrentLocale: () => LocalesKeys,
  fallbackLocale?: Record<string, unknown>,
) {
  return function I18nProviderClient({ children }: I18nProviderProps) {
    const locale = useCurrentLocale();
    const { default: clientLocale } = use(locales[locale as keyof typeof locales]());

    const value = useMemo(
      () => ({
        localeContent: flattenLocale<Locale>(clientLocale),
        fallbackLocale: fallbackLocale ? flattenLocale<Locale>(fallbackLocale) : undefined,
        locale: locale as string,
      }),
      [clientLocale, locale],
    );

    return <I18nClientContext.Provider value={value}>{children}</I18nClientContext.Provider>;
  };
}
