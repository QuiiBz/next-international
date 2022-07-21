import { Locale, LocaleValue, BaseLocale } from '../types';

export function createDefineLocale<LocaleType extends BaseLocale>() {
  return function defineLocale(locale: { [key in keyof LocaleType]: LocaleValue }) {
    return locale;
  };
}
