import 'client-only';
import type { ExplicitLocales, GetLocaleType, ImportedLocales } from 'international-types';
import type { LocaleContext } from '../../types';
import { createI18nProvider } from './create-i18n-provider';
import { createContext } from 'react';
import { createUsei18n } from '../../common/create-use-i18n';
import { createScopedUsei18n } from '../../common/create-use-scoped-i18n';
import { createUseChangeLocale } from './create-use-change-locale';
import { createDefineLocale } from '../../common/create-define-locale';
import { createGetLocaleProps } from '../../common/create-get-locale-static-props';
import { createUseCurrentLocale } from '../../common/create-use-current-locale';

export function createI18nClient<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
) {
  type Locale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;
  type LocalesKeys = OtherLocales extends ExplicitLocales ? keyof OtherLocales : keyof Locales;

  const I18nContext = createContext<LocaleContext<Locale> | null>(null);
  const I18nProvider = createI18nProvider(I18nContext, locales);
  const useI18n = createUsei18n(I18nContext);
  const useScopedI18n = createScopedUsei18n(I18nContext);
  const useChangeLocale = createUseChangeLocale<LocalesKeys>(Object.keys(locales));
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
