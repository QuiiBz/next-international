import type { GetLocale, LocaleType, LocalesObject } from 'international-types';
import type {
  CreateI18n,
  GenerateI18nStaticParams,
  I18nConfig,
  UseChangeLocale,
  GetI18n,
  UseLocale,
  GetScopedI18n,
} from './types';
import { SEGMENT_NAME } from './constants';
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
import { createT } from './utils';

function getLocaleCache(config: I18nConfig) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const params = useParams();
  const locale = params[config.segmentName ?? SEGMENT_NAME];

  if (typeof locale !== 'string') {
    throw new Error(`Invariant: locale not found in params: ${JSON.stringify(params, null, 2)}`);
  }

  return locale;
}

export function createI18n<Locales extends LocalesObject, Locale extends LocaleType = GetLocale<Locales>>(
  locales: Locales,
  config: I18nConfig = {},
): CreateI18n<Locales, Locale> {
  const localesCache = new Map<string, Record<string, unknown>>();

  const getI18n: GetI18n<Locale> = async () => {
    const locale = getLocaleCache(config);
    const data = localesCache.get(locale) ?? (await locales[locale]()).default;

    // @ts-expect-error - no types
    return (key, ...params) => createT(locale, data, undefined, key, ...params);
  };

  const getScopedI18n: GetScopedI18n<Locale> = async scope => {
    const locale = getLocaleCache(config);
    const data = localesCache.get(locale) ?? (await locales[locale]()).default;

    // @ts-expect-error - no types
    return (key, ...params) => createT(locale, data, scope, key, ...params);
  };

  const generateI18nStaticParams: GenerateI18nStaticParams = () => {
    return Object.keys(locales).map(locale => ({ [config.segmentName ?? SEGMENT_NAME]: locale }));
  };

  const getLocale: UseLocale<Locales> = () => {
    return getLocaleCache(config);
  };

  const useChangeLocale: UseChangeLocale<Locales> = changeLocaleConfig => {
    const router = useRouter();
    const currentLocale = getLocaleCache(config);
    const path = usePathname();
    // We call the hook conditionally to avoid always opting out of Static Rendering.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const searchParams = changeLocaleConfig?.preserveSearchParams ? useSearchParams().toString() : undefined;
    const finalSearchParams = searchParams ? `?${searchParams}` : '';

    let pathWithoutLocale = path;

    if (config.basePath) {
      pathWithoutLocale = pathWithoutLocale.replace(config.basePath, '');
    }

    if (pathWithoutLocale.startsWith(`/${currentLocale}/`)) {
      pathWithoutLocale = pathWithoutLocale.replace(`/${currentLocale}/`, '/');
    } else if (pathWithoutLocale === `/${currentLocale}`) {
      pathWithoutLocale = '/';
    }

    return newLocale => {
      if (newLocale === currentLocale) return;

      locales[newLocale]().then(module => {
        const finalLocale = newLocale as string;

        localesCache.set(finalLocale, module.default);
        document.cookie = `locale=${finalLocale};`;
        router.push(`/${newLocale as string}${pathWithoutLocale}${finalSearchParams}`);
      });
    };
  };

  return {
    getI18n,
    getScopedI18n,
    generateI18nStaticParams,
    getLocale,
    useChangeLocale,
  };
}
