import type { BaseLocale, ImportedLocales, Scopes } from 'international-types';
import { createT } from '../../common/create-t';
import { LocaleContext } from '../../types';

export function createGetScopedI18n<Locales extends ImportedLocales, Locale extends BaseLocale>(locales: Locales) {
  return async function getScopedI18n<Scope extends Scopes<Locale>>(locale: string, scope: Scope) {
    return createT(
      {
        localeContent: (await locales[locale]()).default,
        fallbackLocale: undefined,
      } as LocaleContext<Locale>,
      scope,
    );
  };
}
