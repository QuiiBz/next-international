import type { BaseLocale, ImportedLocales } from 'international-types';
import { createT } from '../../common/create-t';
import { I18nServerConfig, LocaleContext } from '../../types';
import { getLocaleCache } from './get-locale-cache';
import { flattenLocale } from '../../common/flatten-locale';

export function createGetI18n<Locales extends ImportedLocales, Locale extends BaseLocale>(
  locales: Locales,
  config: I18nServerConfig<keyof Locales>,
) {
  return async function getI18n() {
    const locale = getLocaleCache();

    return createT(
      {
        localeContent: flattenLocale((await locales[locale]()).default),
        fallbackLocale: config.fallbackLocale
          ? flattenLocale((await locales[config.fallbackLocale]()).default)
          : undefined,
        locale,
      } as LocaleContext<Locale>,
      undefined,
    );
  };
}
