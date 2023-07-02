import type { BaseLocale, ImportedLocales, Scopes } from 'international-types';
import { createT } from '../../common/create-t';
import { LocaleContext } from '../../types';
import { getCurrentLocale } from './create-i18n-provider-server';

export function createGetScopedI18n<Locales extends ImportedLocales, Locale extends BaseLocale>(locales: Locales) {
  return async function getScopedI18n<Scope extends Scopes<Locale>>(scope: Scope) {
    const locale = getCurrentLocale();

    return createT(
      {
        localeContent: (await locales[locale]()).default,
        fallbackLocale: undefined,
      } as LocaleContext<Locale>,
      scope,
    );
  };
}
