import { Locale, LocaleValue } from '../types';

export function createDefineLocale<LocaleType extends Locale>() {
  return function defineLocale(locale: { [key in keyof LocaleType]: LocaleValue }) {
    return locale;
  };
}
