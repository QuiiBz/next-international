import type { Keys, LocaleType, Params, Scopes } from 'international-types';
import type { ReactNode } from 'react';

export type UseI18n<Locale extends LocaleType> = () => <Key extends Keys<Locale>>(
  key: Key,
  ...params: Params<Locale, undefined, Key>
) => string;

export type UseScopedI18n<Locale extends LocaleType> = <Scope extends Scopes<Locale>>(
  scope: Scope,
) => <Key extends Keys<Locale, Scope>>(key: Key, ...params: Params<Locale, Scope, Key>) => string;

export type I18nProviderProps<Locale extends LocaleType> = {
  children: ReactNode;
};

export type I18nProvider<Locale extends LocaleType> = (props: I18nProviderProps<Locale>) => ReactNode;

export type GenerateI18nStaticParams = () => Array<Record<string, string>>;

export type CreateI18n<Locale extends LocaleType> = {
  useI18n: UseI18n<Locale>;
  useScopedI18n: UseScopedI18n<Locale>;
  I18nProvider: I18nProvider<Locale>;
  generateI18nStaticParams: GenerateI18nStaticParams;
};

export type I18nConfig = {
  segmentName?: string;
};