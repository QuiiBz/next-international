import React, { ReactNode, createServerContext } from 'react';

type I18nContextProps = {
  locale: string;
  children: ReactNode;
};

export type I18nContext = {
  locale: string;
};

export const I18nServerContext = createServerContext<string>('locale', '');

export function createI18nContext() {
  return function I18nContext({ locale, children }: I18nContextProps) {
    return <I18nServerContext.Provider value={locale}>{children}</I18nServerContext.Provider>;
  };
}
