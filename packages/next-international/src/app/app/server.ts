import type { GetLocale, LocaleType, LocalesObject } from 'international-types';
import type { CreateI18n, UseI18n, UseScopedI18n } from './types';

export function createI18n<Locales extends LocalesObject, Locale extends LocaleType = GetLocale<Locales>>(
  locales: Locales,
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

  return {
    useI18n,
    useScopedI18n,
  };
}
