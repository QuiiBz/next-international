import type { GetLocale, LocaleType, LocalesObject } from 'international-types';
import type { CreateI18n, UseI18n, UseScopedI18n } from './types';
import { createI18nProvider } from './provider';

export function createI18n<Locales extends LocalesObject, Locale extends LocaleType = GetLocale<Locales>>(
  locales: Locales,
): CreateI18n<Locale> {
  const useI18n: UseI18n<Locale> = () => {
    return (key, ...params) => {
      return 'client';
    };
  };

  const useScopedI18n: UseScopedI18n<Locale> = scope => {
    return (key, ...params) => {
      return 'client';
    };
  };

  return {
    useI18n,
    useScopedI18n,
    I18nProvider: createI18nProvider<Locale>(),
  };
}
