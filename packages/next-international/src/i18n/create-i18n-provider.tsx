import React, { Context, ReactElement, ReactNode, useEffect, useState } from 'react';
import type { LocaleContext, Locales } from '../types';
import type { BaseLocale } from 'international-types';
import { useRouter } from 'next/router';
import { error, warn } from '../helpers/log';

type I18nProviderProps<Locale extends BaseLocale> = {
  locale: Locale;
  fallback?: ReactElement | null;
  fallbackLocale?: Locale;
  children: ReactNode;
};

export function createI18nProvider<Locale extends BaseLocale>(
  I18nContext: Context<LocaleContext<Locale> | null>,
  locales: Locales,
) {
  return function I18nProvider({
    locale: baseLocale,
    fallback = null,
    fallbackLocale,
    children,
  }: I18nProviderProps<Locale>) {
    const { locale, defaultLocale, locales: nextLocales } = useRouter();
    const [clientLocale, setClientLocale] = useState<Locale>();

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

    useEffect(() => {
      if (!locale || !defaultLocale) {
        return;
      }

      locales[locale]().then(content => {
        setClientLocale(content.default as Locale);
      });
    }, [locale, defaultLocale]);

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
          localeContent: clientLocale || baseLocale,
          fallbackLocale,
        }}
      >
        {children}
      </I18nContext.Provider>
    );
  };
}
