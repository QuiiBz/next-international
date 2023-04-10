import type { BaseLocale, ImportedLocales } from 'international-types';
import { createT } from '../../common/create-t';
import { LocaleContext } from '../../types';

export function createGetI18n<Locale extends BaseLocale>(locales: ImportedLocales) {
  return async function getI18n(locale: string) {
    return createT(
      {
        localeContent: (await locales[locale]()).default,
        fallbackLocale: undefined,
      } as LocaleContext<Locale>,
      undefined,
    );
  };
}
