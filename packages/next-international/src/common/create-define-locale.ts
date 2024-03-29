import type { BaseLocale, LocaleValue } from 'international-types';

export function createDefineLocale<Locale extends BaseLocale>() {
  return function defineLocale(locale: { [key in keyof Locale]: LocaleValue }) {
    return locale;
  };
}
