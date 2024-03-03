import type { GetLocale, LocaleType, LocalesObject } from 'international-types';
import type {
  CreateI18n,
  GenerateI18nStaticParams,
  I18nConfig,
  UseChangeLocale,
  UseI18n,
  UseLocale,
  UseScopedI18n,
} from './types';
import { SEGMENT_NAME } from './constants';
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation';
// @ts-expect-error - no types
import { use } from 'react';
import { createT } from './utils';

function useLocaleCache(config: I18nConfig) {
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

  const useI18n: UseI18n<Locale> = () => {
    const locale = useLocaleCache(config);
    const data = localesCache.get(locale) ?? use(locales[locale]()).default;

    if (!localesCache.has(locale)) {
      localesCache.set(locale, data);
    }

    return (key, ...params) => createT(locale, data, undefined, key, ...params);
  };

  const useScopedI18n: UseScopedI18n<Locale> = scope => {
    const locale = useLocaleCache(config);
    const data = localesCache.get(locale) ?? use(locales[locale]()).default;

    if (!localesCache.has(locale)) {
      localesCache.set(locale, data);
    }

    // @ts-expect-error - no types
    return (key, ...params) => createT(locale, data, scope, key, ...params);
  };

  const generateI18nStaticParams: GenerateI18nStaticParams = () => {
    return Object.keys(locales).map(locale => ({ [config.segmentName ?? SEGMENT_NAME]: locale }));
  };

  const useLocale: UseLocale<Locales> = () => {
    return useLocaleCache(config);
  };

  const useChangeLocale: UseChangeLocale<Locales> = changeLocaleConfig => {
    const router = useRouter();
    const currentLocale = useLocaleCache(config);
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
        localesCache.set(newLocale as string, module.default);

        const finalLocale = newLocale as string;
        localesCache.set(finalLocale, module.default);

        document.cookie = `locale=${finalLocale};`;

        router.push(`/${newLocale as string}${pathWithoutLocale}${finalSearchParams}`);
      });
    };
  };

  return {
    useI18n,
    useScopedI18n,
    generateI18nStaticParams,
    useLocale,
    useChangeLocale,
  };
}
