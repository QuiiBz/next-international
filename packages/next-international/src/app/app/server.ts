import type { GetLocale, LocaleType, LocalesObject } from 'international-types';
import type { CreateI18n, GenerateI18nStaticParams, I18nConfig, UseI18n, UseScopedI18n } from './types';
import { createI18nProvider } from './provider';
import { SEGMENT_NAME } from './constants';

export function createI18n<Locales extends LocalesObject, Locale extends LocaleType = GetLocale<Locales>>(
  locales: Locales,
  config: I18nConfig = {},
): CreateI18n<Locale> {
  const useI18n: UseI18n<Locale> = () => {
    return (key, ...params) => {
      return 'server';
    };
  };

  const useScopedI18n: UseScopedI18n<Locale> = scope => {
    return (key, ...params) => {
      return 'server';
    };
  };

  const I18nProvider = createI18nProvider<Locale>();

  const generateI18nStaticParams: GenerateI18nStaticParams = () => {
    return Object.keys(locales).map(locale => ({ [config.segmentName ?? SEGMENT_NAME]: locale }));
  };

  return {
    useI18n,
    useScopedI18n,
    I18nProvider,
    generateI18nStaticParams,
  };
}
