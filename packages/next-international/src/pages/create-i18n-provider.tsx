import React, { Context, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import type { LocaleContext } from '../types';
import type { BaseLocale, ImportedLocales } from 'international-types';
import { useRouter } from 'next/router';
import { error, warn } from '../helpers/log';
import { flattenLocale } from '../common/flatten-locale';

type I18nProviderProps<Locale extends BaseLocale> = {
  locale: Locale;
  fallback?: ReactElement | null;
  fallbackLocale?: Locale;
  children: ReactNode;
};

export function createI18nProvider<Locale extends BaseLocale>(
  I18nContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
) {
  return function I18nProvider({
    locale: baseLocale,
    fallback = null,
    fallbackLocale,
    children,
  }: I18nProviderProps<Locale>) {
    const { locale, defaultLocale, locales: nextLocales } = useRouter();
    const [clientLocale, setClientLocale] = useState<Locale>();
    const initialLoadRef = useRef(true);

    useEffect(() => {
      function checkConfigMatch([first, second]: [[string, string[]], [string, string[]]]) {
        const notDefined = first[1].filter(locale => !second[1].includes(locale));

        if (notDefined.length > 0) {
          warn(
            `The following locales are defined in '${first[0]}' but not in '${second[0]}': ${notDefined.join(', ')}`,
          );
        }
      }

      const createI18n = ['createI18n', Object.keys(locales)] as [string, string[]];
      const nextConfig = ['next.config.js', nextLocales || []] as [string, string[]];

      checkConfigMatch([createI18n, nextConfig]);
      checkConfigMatch([nextConfig, createI18n]);
    }, [nextLocales]);

    const loadLocale = useCallback((locale: string) => {
      locales[locale]().then(content => {
        setClientLocale(flattenLocale(content.default));
      });
    }, []);

    useEffect(() => {
      // Initial page load
      // Load locale if no baseLocale provided from getLocaleProps
      if (!baseLocale && locale && initialLoadRef.current) {
        loadLocale(locale);
      }

      // // Subsequent locale change
      if (locale && !initialLoadRef.current) {
        loadLocale(locale);
      }

      initialLoadRef.current = false;
    }, [baseLocale, loadLocale, locale]);

    if (!locale || !defaultLocale) {
      return error(`'i18n.defaultLocale' not defined in 'next.config.js'`);
    }

    if (!nextLocales) {
      return error(`'i18n.locales' not defined in 'next.config.js'`);
    }

    if (!clientLocale && !baseLocale) {
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
