import React, { createContext } from 'react';
import type { Locales, Locale, LocaleContext } from '../types';
import { createDefineLocale } from './create-define-locale';
import { createGetLocaleStaticProps } from './create-get-locale-static-props';
import { createI18nProvider } from './create-i18n-provider';
import { createUseChangeLocale } from './create-use-change-locale';
import { createUsei18n } from './create-use-i18n';

export function createI18n<LocaleType extends Locale>(locales: Locales) {
  const I18nContext = createContext<LocaleContext<LocaleType> | null>(null);
  const I18nProvider = createI18nProvider(I18nContext, locales);
  const useI18n = createUsei18n(I18nContext);
  const useChangeLocale = createUseChangeLocale<typeof locales>();
  const defineLocale = createDefineLocale<LocaleType>();
  const getLocaleStaticProps = createGetLocaleStaticProps(locales);

  return {
    useI18n,
    I18nProvider,
    useChangeLocale,
    defineLocale,
    getLocaleStaticProps,
  };
}
