import type { BaseLocale, ImportedLocales } from 'international-types';
import { notFound } from 'next/navigation';
import type { Context, ReactNode } from 'react';
import React, { Suspense, use, useMemo } from 'react';
import { flattenLocale } from '../../common/flatten-locale';
import { error } from '../../helpers/log';
import type { LocaleContext } from '../../types';

type I18nProviderProps = Omit<I18nProviderWrapperProps, 'fallback'> & {
  importLocale: Promise<Record<string, unknown>>;
};

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
  function I18nProvider({ locale, importLocale, children }: I18nProviderProps) {
    const clientLocale = (localesCache.get(locale) ?? localesCache.set(locale, use(importLocale).default)) as Record<string, unknown>;

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
    const importFnLocale = locales[locale as keyof typeof locales];

    if (!importFnLocale) {
      error(`The locale '${locale}' is not supported. Defined locales are: [${Object.keys(locales).join(', ')}].`);
      notFound();
    }

    return (
      <Suspense fallback={fallback}>
        <I18nProvider locale={locale} importLocale={importFnLocale()}>
          {children}
        </I18nProvider>
      </Suspense>
    );
  };
}
