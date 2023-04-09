import type { ExplicitLocales, GetLocaleType, ImportedLocales, Scopes } from 'international-types';
import { createT } from '../i18n/create-t';
import type { LocaleContext } from '../types';

export function createAppI18n<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
) {
  type Locale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;

  return {
    getI18n: async (locale: string) => {
      return createT(
        {
          localeContent: (await locales[locale]()).default,
          fallbackLocale: null,
        } as LocaleContext<Locale>,
        undefined,
      );
    },
    getScopedI18n: async <Scope extends Scopes<Locale>>(locale: string, scope: Scope) => {
      return createT(
        {
          localeContent: (await locales[locale]()).default,
          fallbackLocale: null,
        } as LocaleContext<Locale>,
        scope,
      );
    },
  };
}
