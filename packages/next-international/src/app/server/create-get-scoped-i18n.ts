import type { BaseLocale, ImportedLocales, Scopes } from 'international-types';
import { createT } from '../../common/create-t';
import type { I18nServerConfig, LocaleContext } from '../../types';
import { getLocaleCache } from './get-locale-cache';
import { flattenLocale } from '../../common/flatten-locale';

export function createGetScopedI18n<Locales extends ImportedLocales, Locale extends BaseLocale>(
  locales: Locales,
  config: I18nServerConfig,
) {
  const localeCache = new Map<string, Promise<ReturnType<typeof createT<Locale, undefined>>>>();

  return async function getScopedI18n<Scope extends Scopes<Locale>>(
    scope: Scope,
  ): Promise<ReturnType<typeof createT<Locale, Scope>>> {
    const locale = await getLocaleCache();
    const cacheKey = `${locale}-${scope}`;
    const cached = localeCache.get(cacheKey);

    if (cached) {
      return (await cached) as ReturnType<typeof createT<Locale, Scope>>;
    }

    const localeFnPromise = (async () => {
      const localeModule = await locales[locale]();
      return createT(
        {
          localeContent: flattenLocale(localeModule.default),
          fallbackLocale: config.fallbackLocale ? flattenLocale(config.fallbackLocale) : undefined,
          locale,
        } as LocaleContext<Locale>,
        scope,
      );
    })();

    localeCache.set(cacheKey, localeFnPromise);

    return await localeFnPromise;
  };
}
