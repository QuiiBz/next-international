import type { BaseLocale, ImportedLocales, Scopes } from 'international-types';
import { createT } from '../../common/create-t';
import { LocaleContext } from '../../types';
import { getLocaleCache } from './get-locale-cache';
import { flattenLocale } from '../../common/flatten-locale';

export function createGetScopedI18n<Locales extends ImportedLocales, Locale extends BaseLocale>(locales: Locales) {
  return async function getScopedI18n<Scope extends Scopes<Locale>>(scope: Scope) {
    const locale = getLocaleCache();

    return createT(
      {
        localeContent: flattenLocale((await locales[locale]()).default),
        fallbackLocale: undefined,
      } as LocaleContext<Locale>,
      scope,
    );
  };
}
