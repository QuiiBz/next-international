import type { Context } from 'react';
import { useContext } from 'react';
import type { BaseLocale, Scopes } from 'international-types';
import type { LocaleContext } from '../types';
import { createT } from '../common/create-t';

export function createScopedUsei18n<Locale extends BaseLocale>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
) {
  const localeCache = new Map<string, ReturnType<typeof createT<Locale, undefined>>>();

  return function useScopedI18n<Scope extends Scopes<Locale>>(scope: Scope): ReturnType<typeof createT<Locale, Scope>> {
    const context = useContext(I18nClientContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    const cacheKey = `${context.locale}-${scope}`;
    const cached = localeCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const localeFn = createT(context, scope);

    localeCache.set(cacheKey, localeFn);

    return localeFn;
  };
}
