import type { Keys, LocaleType, Params, Scopes } from 'international-types';

export type UseI18n<Locale extends LocaleType> = () => <Key extends Keys<Locale>>(
  key: Key,
  ...params: Params<Locale, undefined, Key>
) => string;

export type UseScopedI18n<Locale extends LocaleType> = <Scope extends Scopes<Locale>>(
  scope: Scope,
) => <Key extends Keys<Locale, Scope>>(key: Key, ...params: Params<Locale, Scope, Key>) => string;

export type CreateI18n<Locale extends LocaleType> = {
  useI18n: UseI18n<Locale>;
  useScopedI18n: UseScopedI18n<Locale>;
};
