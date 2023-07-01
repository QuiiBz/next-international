import type { BaseLocale, ImportedLocales } from 'international-types';
import { createT } from '../../common/create-t';
import { LocaleContext } from '../../types';
import { getCurrentLocale } from './create-i18n-provider-server';

export function createGetI18n<Locale extends BaseLocale>(locales: ImportedLocales) {
  return async function getI18n() {
    const locale = getCurrentLocale();

    return createT(
      {
        localeContent: (await locales[locale]()).default,
        fallbackLocale: undefined,
      } as LocaleContext<Locale>,
      undefined,
    );
  };
}
