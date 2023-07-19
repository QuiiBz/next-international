import type { BaseLocale, ImportedLocales } from 'international-types';
import { createT } from '../../common/create-t';
import { LocaleContext } from '../../types';
import { getLocaleCache } from './get-locale-cache';
import { flattenLocale } from '../../common/flatten-locale';

export function createGetI18n<Locale extends BaseLocale>(locales: ImportedLocales) {
  return async function getI18n() {
    const locale = getLocaleCache();

    return createT(
      {
        localeContent: flattenLocale((await locales[locale]()).default),
        fallbackLocale: undefined,
      } as LocaleContext<Locale>,
      undefined,
    );
  };
}
