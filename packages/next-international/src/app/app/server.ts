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
// @ts-expect-error - no types
import { cache } from 'react';
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';
import { createT } from './utils';

const getLocaleCache = cache(() => {
  const store = staticGenerationAsyncStorage.getStore();
  const url = store?.urlPathname;

  if (typeof url !== 'string') {
    throw new Error('Invariant: urlPathname is not a string: ' + JSON.stringify(store, null, 2));
  }

  let locale = url.split('/')[1].split('?')[0];

  if (locale === '') {
    const cookie = (store?.incrementalCache?.requestHeaders?.['cookie'] as string)
      ?.split(';')
      .find(c => c.trim().startsWith('locale='))
      ?.split('=')[1];

    if (!cookie) {
      throw new Error('Invariant: locale cookie not found');
    }

    locale = cookie;
  }

  return locale;
});

export function createI18n<Locales extends LocalesObject, Locale extends LocaleType = GetLocale<Locales>>(
  locales: Locales,
  config: I18nConfig = {},
): CreateI18n<Locales, Locale> {
  const getI18n: GetI18n<Locale> = async () => {
    const locale = getLocaleCache();
    const data = (await locales[locale]()).default;

    return (key, ...params) => createT(locale, data, undefined, key, ...params);
  };

  const getScopedI18n: GetScopedI18n<Locale> = async scope => {
    const locale = getLocaleCache();
    const data = (await locales[locale]()).default;

    // @ts-expect-error - no types
    return (key, ...params) => createT(locale, data, scope, key, ...params);
  };

  const generateI18nStaticParams: GenerateI18nStaticParams = () => {
    return Object.keys(locales).map(locale => ({ [config.segmentName ?? SEGMENT_NAME]: locale }));
  };

  const getLocale: UseLocale<Locales> = () => {
    return getLocaleCache();
  };

  const useChangeLocale: UseChangeLocale<Locales> = () => {
    return () => {
      throw new Error('Invariant: useChangeLocale only works in Client Components');
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
