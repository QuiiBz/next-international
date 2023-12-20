import type { BaseLocale, ImportedLocales } from 'international-types';
import { createT } from '../../common/create-t';
import { flattenLocale } from '../../common/flatten-locale';
import type { I18nServerConfig, LocaleContext } from '../../types';
import { getLocaleCache } from './get-locale-cache';

export function createGetI18n<Locales extends ImportedLocales, Locale extends BaseLocale>(
  locales: Locales,
  config: I18nServerConfig,
) {
  const localeCache = new Map<string, ReturnType<typeof createT<Locale, undefined>>>();

  return async function getI18n() {
    const locale = getLocaleCache();
    const cached = localeCache.get(locale);

    if (cached) {
      return cached;
    }

    const localeFn = createT(
      {
        localeContent: flattenLocale((await locales[locale]()).default),
        fallbackLocale: config.fallbackLocale ? flattenLocale(config.fallbackLocale) : undefined,
        locale,
      } as LocaleContext<Locale>,
      undefined,
    );

    localeCache.set(locale, localeFn);

    return localeFn;
  };
}
