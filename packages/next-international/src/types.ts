import type { BaseLocale, LocaleValue, Params } from 'international-types';

export type LocaleContext<Locale extends BaseLocale> = {
  locale: string;
  localeContent: Locale;
  fallbackLocale?: Locale;
};

export type LocaleMap<T> = Record<keyof T, React.ReactNode>;

export type ReactParamsObject<Value extends LocaleValue> = Record<Params<Value>[number], React.ReactNode>;
