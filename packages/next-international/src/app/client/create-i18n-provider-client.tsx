import React, { Context, ReactNode, Suspense, useEffect, useMemo, useState } from 'react';
import type { BaseLocale, ImportedLocales } from 'international-types';

import type { LocaleContext } from '../../types';
import { flattenLocale } from '../../common/flatten-locale';

type I18nProviderProps = Omit<I18nProviderWrapperProps, 'fallback'>;

type I18nProviderWrapperProps = {
  locale: string;
  fallback?: ReactNode;
  children: ReactNode;
};

const promises: Record<
  string,
  {
    status: 'pending' | 'fulfilled' | 'rejected';
    value?: any;
    reason?: any;
  }
> = {};
let previousLocale: any;

function useSuspenseOnce<T>(promise: Promise<T>, key: string, rerender: () => void): T {
  const thePromise = promises[key];
  if (thePromise?.status === 'fulfilled') {
    previousLocale = thePromise.value;
    return thePromise.value;
  } else if (thePromise?.status === 'rejected') {
    throw thePromise.reason;
  } else if (thePromise?.status === 'pending' && !previousLocale) {
    throw promise;
  } else {
    promises[key] = {
      status: 'pending',
    };

    promise.then(
      result => {
        promises[key].status = 'fulfilled';
        promises[key].value = result;
        rerender();
      },
      reason => {
        promises[key].status = 'rejected';
        promises[key].reason = reason;
      },
    );

    if (previousLocale) {
      return previousLocale;
    } else {
      throw promise;
    }
  }
}

export function createI18nProviderClient<Locale extends BaseLocale>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
  locales: ImportedLocales,
  fallbackLocale?: Record<string, unknown>,
) {
  function I18nProvider({ locale, children }: I18nProviderProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [, increment] = useState(0);

    const { default: clientLocale } = useSuspenseOnce(locales[locale as keyof typeof locales](), locale, () => {
      if (isMounted) {
        increment(i => i + 1);
      }
    });

    useEffect(() => {
      setIsMounted(true);
    }, [isMounted]);

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
