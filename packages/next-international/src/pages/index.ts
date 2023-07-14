import { createContext } from 'react';
import { ImportedLocales, ExplicitLocales, GetLocaleType, FlattenLocale } from 'international-types';
import type { LocaleContext } from '../types';
import { createDefineLocale } from '../common/create-define-locale';
import { createGetLocaleProps } from './create-get-locale-props';
import { createI18nProvider } from './create-i18n-provider';
import { createUseChangeLocale } from './create-use-change-locale';
import { createUsei18n } from '../common/create-use-i18n';
import { createScopedUsei18n } from '../common/create-use-scoped-i18n';
import { createUseCurrentLocale } from './create-use-current-locale';

export function createI18n<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
) {
  type TempLocale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;
  type Locale = TempLocale extends Record<string, string> ? TempLocale : FlattenLocale<TempLocale>;

  type LocalesKeys = OtherLocales extends ExplicitLocales ? keyof OtherLocales : keyof Locales;

  // @ts-expect-error deep type
  const I18nContext = createContext<LocaleContext<Locale> | null>(null);
  const I18nProvider = createI18nProvider(I18nContext, locales);
  const useI18n = createUsei18n(I18nContext);
  const useScopedI18n = createScopedUsei18n(I18nContext);
  const useChangeLocale = createUseChangeLocale<LocalesKeys>();
  const defineLocale = createDefineLocale<Locale>();
  const getLocaleProps = createGetLocaleProps(locales);
  const useCurrentLocale = createUseCurrentLocale<LocalesKeys>();

  return {
    useI18n,
    useScopedI18n,
    I18nProvider,
    useChangeLocale,
    defineLocale,
    getLocaleProps,
    useCurrentLocale,
  };
}
