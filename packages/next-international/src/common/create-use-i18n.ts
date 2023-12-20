import type { Context } from 'react';
import { useContext } from 'react';
import type { BaseLocale } from 'international-types';
import type { LocaleContext } from '../types';
import { createT } from './create-t';

export function createUsei18n<Locale extends BaseLocale>(I18nClientContext: Context<LocaleContext<Locale> | null>) {
  const localeCache = new Map<string, ReturnType<typeof createT<Locale, undefined>>>();

  return function useI18n() {
    const context = useContext(I18nClientContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    const cached = localeCache.get(context.locale);

    if (cached) {
      return cached;
    }

    const localeFn = createT(context, undefined);

    localeCache.set(context.locale, localeFn);

    return localeFn;
  };
}
