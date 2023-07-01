import { cache } from 'react';
import { ReactNode } from 'react';

type I18nContextProps = {
  locale: string;
  children: ReactNode;
};

const localeCache = cache<() => { current: string | undefined }>(() => ({ current: undefined }));

export function getCurrentLocale() {
  const currentLocale = localeCache().current;

  if (!currentLocale) {
    throw new Error('No locale set, make sure to use the I18nProviderServer component');
  }

  return currentLocale;
}

export function setCurrentLocale(locale: string) {
  localeCache().current = locale;
}

export function createI18nProviderServer() {
  return function I18nProviderServer({ locale, children }: I18nContextProps) {
    setCurrentLocale(locale);

    return children;
  };
}
