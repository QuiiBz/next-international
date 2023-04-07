import type { BaseLocale, LocaleValue, Params } from 'international-types';

export type Locales = Record<string, () => Promise<any>>;

export type LocaleContext<Locale extends BaseLocale> = {
  localeContent: Locale;
  fallbackLocale?: Locale;
};

export type LocaleMap<T> = Record<keyof T, React.ReactNode>;

export type ReactParamsObject<Value extends LocaleValue> = Record<Params<Value>[number], React.ReactNode>;
