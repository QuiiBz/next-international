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
// @ts-expect-error - no types
import { cache } from 'react';
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';

const useLocaleCache = cache(() => {
  const store = staticGenerationAsyncStorage.getStore();
  const url = store?.urlPathname;

  if (typeof url !== 'string') {
    throw new Error('Invariant: urlPathname is not a string: ' + JSON.stringify(store, null, 2));
  }

  return url.split('/')[1].split('?')[0];
});

export function createI18n<Locales extends LocalesObject, Locale extends LocaleType = GetLocale<Locales>>(
  locales: Locales,
  config: I18nConfig = {},
): CreateI18n<Locales, Locale> {
  const useI18n: UseI18n<Locale> = () => {
    const locale = useLocaleCache();

    return (key, ...params) => {
      return 'server: ' + locale;
    };
  };

  const useScopedI18n: UseScopedI18n<Locale> = scope => {
    const locale = useLocaleCache();

    return (key, ...params) => {
      return 'server: ' + locale;
    };
  };

  const generateI18nStaticParams: GenerateI18nStaticParams = () => {
    return Object.keys(locales).map(locale => ({ [config.segmentName ?? SEGMENT_NAME]: locale }));
  };

  const useLocale: UseLocale<Locales> = () => {
    return useLocaleCache();
  };

  const useChangeLocale: UseChangeLocale<Locales> = () => {
    return () => {
      throw new Error('Invariant: useChangeLocale only works in Client Components');
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
