import type { BaseLocale } from 'international-types';

export type Locales = Record<string, () => Promise<any>>;

export type LocaleContext<Locale extends BaseLocale> = {
  localeContent: Locale;
  fallbackLocale?: Locale;
};
