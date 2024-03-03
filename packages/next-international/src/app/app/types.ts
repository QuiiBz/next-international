import type { Keys, LocaleType, LocalesObject, Params, Scopes } from 'international-types';

export type UseI18n<Locale extends LocaleType> = () => <Key extends Keys<Locale>>(
  key: Key,
  ...params: Params<Locale, undefined, Key>
) => string;

export type UseScopedI18n<Locale extends LocaleType> = <Scope extends Scopes<Locale>>(
  scope: Scope,
) => <Key extends Keys<Locale, Scope>>(key: Key, ...params: Params<Locale, Scope, Key>) => string;

export type GenerateI18nStaticParams = () => Array<Record<string, string>>;

export type UseLocale<Locales extends LocalesObject> = () => keyof Locales;

export type UseChangeLocale<Locales extends LocalesObject> = () => (locale: keyof Locales) => void;

export type CreateI18n<Locales extends LocalesObject, Locale extends LocaleType> = {
  useI18n: UseI18n<Locale>;
  useScopedI18n: UseScopedI18n<Locale>;
  generateI18nStaticParams: GenerateI18nStaticParams;
  useLocale: UseLocale<Locales>;
  useChangeLocale: UseChangeLocale<Locales>;
};

export type I18nConfig = {
  segmentName?: string;
};
