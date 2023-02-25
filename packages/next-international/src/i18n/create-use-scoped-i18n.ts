import { useContext, Context } from 'react';
import type { BaseLocale, Scopes } from 'international-types';
import type { LocaleContext } from '../types';
import { createT } from './create-t';

export function createScopedUsei18n<Locale extends BaseLocale>(I18nContext: Context<LocaleContext<Locale> | null>) {
  return function useScopedI18n<Scope extends Scopes<Locale> | undefined>(scope: Scope) {
    const context = useContext(I18nContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    return createT(context, scope);
  };
}
