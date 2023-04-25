import { useContext, Context } from 'react';
import type { BaseLocale } from 'international-types';
import type { LocaleContext } from '../types';
import { createT } from './create-t';
import { useRouter } from 'next/router';

export function createUsei18n<Locale extends BaseLocale>(I18nContext: Context<LocaleContext<Locale> | null>) {
  return function useI18n() {
    const context = useContext(I18nContext);
    const { locale } = useRouter();

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    return createT(context, undefined, locale);
  };
}
