import 'client-only';
import type { ExplicitLocales, FlattenLocale, GetLocaleType, ImportedLocales } from 'international-types';
import type { I18nClientConfig, LocaleContext } from '../../types';
import { createI18nProviderClient } from './create-i18n-provider-client';
import { createContext } from 'react';
import { createUsei18n } from '../../common/create-use-i18n';
import { createScopedUsei18n } from '../../common/create-use-scoped-i18n';
import { createUseChangeLocale } from './create-use-change-locale';
import { createDefineLocale } from '../../common/create-define-locale';
import { createUseCurrentLocale } from './create-use-current-locale';

export function createI18nClient<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
  config: I18nClientConfig = {},
) {
  type TempLocale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;
  type Locale = TempLocale extends Record<string, string> ? TempLocale : FlattenLocale<TempLocale>;

  type LocalesKeys = OtherLocales extends ExplicitLocales ? keyof OtherLocales : keyof Locales;

  const localesKeys = Object.keys(locales) as LocalesKeys[];

  // @ts-expect-error deep type
  const I18nClientContext = createContext<LocaleContext<Locale> | null>(null);

  const useCurrentLocale = createUseCurrentLocale<LocalesKeys>(localesKeys, config);
  const I18nProviderClient = createI18nProviderClient<Locale, LocalesKeys>(
    I18nClientContext,
    locales,
    useCurrentLocale,
    config.fallbackLocale,
  );
  const useI18n = createUsei18n(I18nClientContext);
  const useScopedI18n = createScopedUsei18n(I18nClientContext);
  const useChangeLocale = createUseChangeLocale<LocalesKeys>(useCurrentLocale, config);
  const defineLocale = createDefineLocale<Locale>();

  return {
    useI18n,
    useScopedI18n,
    I18nProviderClient,
    I18nClientContext,
    useChangeLocale,
    defineLocale,
    useCurrentLocale,
  };
}
