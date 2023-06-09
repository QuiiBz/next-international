import 'server-only';
import type { ExplicitLocales, GetLocaleType, ImportedLocales } from 'international-types';
import { createGetI18n } from './create-get-i18n';
import { createGetScopedI18n } from './create-get-scoped-i18n';
import { createI18nContext } from './create-i18n-context';

export { I18nServerContext } from './create-i18n-context';

export function createI18nServer<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
) {
  type Locale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;

  const I18nContext = createI18nContext();
  const getI18n = createGetI18n<Locale>(locales);
  const getScopedI18n = createGetScopedI18n<Locales, Locale>(locales);

  return {
    I18nContext,
    getI18n,
    getScopedI18n,
  };
}
