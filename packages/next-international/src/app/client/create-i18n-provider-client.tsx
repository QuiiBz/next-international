import { notFound } from 'next/navigation';
import type { BaseLocale, ImportedLocales } from 'international-types';
import type { Context, ReactNode } from 'react';
import React, { Suspense, use, useMemo } from 'react';
import { flattenLocale } from '../../common/flatten-locale';
import { error } from '../../helpers/log';
import type { LocaleContext } from '../../types';

type I18nProviderProps = Omit<I18nProviderWrapperProps, 'fallback'>;

type I18nProviderWrapperProps = {
  locale: string;
  fallback?: ReactNode;
  children: ReactNode;
};

export const localesCache = new Map<string, Record<string, unknown>>();

export function createI18nProviderClient<Locale extends BaseLocale>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
  fallbackLocale?: Record<string, unknown>,
) {
  function I18nProvider({ locale, children }: I18nProviderProps) {
    let clientLocale: any = localesCache.get(locale);

    if (!clientLocale) {
      const newLocale = locales[locale as keyof typeof locales];

      if (!newLocale) {
        error(`The locale '${locale}' is not supported. Defined locales are: [${Object.keys(locales).join(', ')}].`);
        notFound();
      }

      clientLocale = use(newLocale()).default;
      localesCache.set(locale, clientLocale);
    }

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

  return function I18nProviderWrapper({ locale, fallback, children }: I18nProviderWrapperProps) {
    return (
      <Suspense fallback={fallback}>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </Suspense>
    );
  };
}
