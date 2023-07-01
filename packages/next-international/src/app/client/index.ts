import 'client-only';
import type { ExplicitLocales, GetLocaleType, ImportedLocales } from 'international-types';
import type { LocaleContext } from '../../types';
import { createI18nProviderClient } from './create-i18n-provider-client';
import { createContext } from 'react';
import { createUsei18n } from '../../common/create-use-i18n';
import { createScopedUsei18n } from '../../common/create-use-scoped-i18n';
import { createUseChangeLocale } from './create-use-change-locale';
import { createDefineLocale } from '../../common/create-define-locale';
import { createGetLocaleProps } from '../../common/create-get-locale-static-props';
import { createUseCurrentLocale } from './create-use-current-locale';

export function createI18nClient<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
) {
  type Locale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;
  type LocalesKeys = OtherLocales extends ExplicitLocales ? keyof OtherLocales : keyof Locales;

  const localesKeys = Object.keys(locales) as LocalesKeys[];

  const I18nClientContext = createContext<LocaleContext<Locale> | null>(null);

  const I18nProviderClient = createI18nProviderClient(I18nClientContext, locales);
  const useI18n = createUsei18n(I18nClientContext);
  const useScopedI18n = createScopedUsei18n(I18nClientContext);
  const useChangeLocale = createUseChangeLocale<LocalesKeys>(localesKeys);
  const defineLocale = createDefineLocale<Locale>();
  const getLocaleProps = createGetLocaleProps(locales);
  const useCurrentLocale = createUseCurrentLocale<LocalesKeys>(localesKeys);

  return {
    useI18n,
    useScopedI18n,
    I18nProviderClient,
    I18nClientContext,
    useChangeLocale,
    defineLocale,
    getLocaleProps,
    useCurrentLocale,
  };
}
