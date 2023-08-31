import 'server-only';

import type { ExplicitLocales, FlattenLocale, GetLocaleType, ImportedLocales } from 'international-types';
import { createGetI18n } from './create-get-i18n';
import { createGetScopedI18n } from './create-get-scoped-i18n';
import { createGetCurrentLocale } from './create-get-current-locale';
import { createGetStaticParams } from './create-get-static-params';
import { I18nServerConfig } from '../../types';

export function createI18nServer<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
  config: I18nServerConfig<keyof Locales> = {},
) {
  type TempLocale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;
  type Locale = TempLocale extends Record<string, string> ? TempLocale : FlattenLocale<TempLocale>;

  type LocalesKeys = OtherLocales extends ExplicitLocales ? keyof OtherLocales : keyof Locales;

  // @ts-expect-error deep type
  const getI18n = createGetI18n<Locales, Locale>(locales, config);
  const getScopedI18n = createGetScopedI18n<Locales, Locale>(locales, config);
  const getCurrentLocale = createGetCurrentLocale<LocalesKeys>();
  const getStaticParams = createGetStaticParams(locales, config);

  return {
    getI18n,
    getScopedI18n,
    getCurrentLocale,
    getStaticParams,
  };
}
