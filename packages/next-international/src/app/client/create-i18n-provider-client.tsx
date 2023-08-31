import React, { Context, ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import type { BaseLocale, ImportedLocales } from 'international-types';

import type { LocaleContext } from '../../types';
import { flattenLocale } from '../../common/flatten-locale';

type I18nProviderProps<LocalesKeys> = {
  fallback?: ReactElement | null;
  fallbackLocale?: LocalesKeys;
  children: ReactNode;
};

export function createI18nProviderClient<Locale extends BaseLocale, LocalesKeys>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
  useCurrentLocale: () => LocalesKeys,
) {
  return function I18nProviderClient({ fallback = null, fallbackLocale, children }: I18nProviderProps<LocalesKeys>) {
    const locale = useCurrentLocale();
    const [clientLocale, setClientLocale] = useState<Locale>();
    const [clientFallbackLocale, setClientFallbackLocale] = useState<Locale>();

    useEffect(() => {
      // @ts-expect-error any type
      locales[locale]().then(content => {
        setClientLocale(flattenLocale<Locale>(content.default));
      });

      if (fallbackLocale) {
        // @ts-expect-error any type
        locales[fallbackLocale]().then(content => {
          setClientFallbackLocale(flattenLocale<Locale>(content.default));
        });
      }
    }, [locale, fallbackLocale]);

    const value = useMemo(
      () => ({
        localeContent: clientLocale as Locale,
        fallbackLocale: clientFallbackLocale as Locale | undefined,
        locale: locale as string,
      }),
      [clientLocale, clientFallbackLocale, locale],
    );

    if (!clientLocale && fallback) {
      return fallback;
    }

    return <I18nClientContext.Provider value={value}>{children}</I18nClientContext.Provider>;
  };
}
