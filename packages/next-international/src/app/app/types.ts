import type { Keys, LocaleType, LocalesObject, Params, Scopes } from 'international-types';
import type { ReactNode } from 'react';

export type UseI18n<Locale extends LocaleType> = () => <Key extends Keys<Locale, undefined>>(
  key: Key,
  ...params: Params<Locale, undefined, Key>
) => string | ReactNode[];

export type UseScopedI18n<Locale extends LocaleType> = <Scope extends Scopes<Locale>>(
  scope: Scope,
) => <Key extends Keys<Locale, Scope>>(key: Key, ...params: Params<Locale, Scope, Key>) => string | ReactNode[];

export type GenerateI18nStaticParams = () => Array<Record<string, string>>;

export type UseLocale<Locales extends LocalesObject> = () => keyof Locales;

type UseChangeLocaleConfig = {
  /**
   * If `true`, the search params will be preserved when changing the locale.
   * Don't forget to **wrap the component in a `Suspense` boundary to avoid opting out the page from Static Rendering**.
   *
   * @see https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering
   * @default false
   */
  preserveSearchParams?: boolean;
};

export type UseChangeLocale<Locales extends LocalesObject> = (
  config?: UseChangeLocaleConfig,
) => (locale: keyof Locales) => void;

export type CreateI18n<Locales extends LocalesObject, Locale extends LocaleType> = {
  useI18n: UseI18n<Locale>;
  useScopedI18n: UseScopedI18n<Locale>;
  generateI18nStaticParams: GenerateI18nStaticParams;
  useLocale: UseLocale<Locales>;
  useChangeLocale: UseChangeLocale<Locales>;
};

export type I18nConfig = {
  /**
   * The name of the Next.js layout segment param that will be used to determine the locale in a client component.
   *
   * An app directory folder hierarchy that looks like `app/[locale]/products/[category]/[subCategory]/page.tsx` would be `locale`.
   *
   * @default locale
   */
  segmentName?: string;
  /**
   * If you are using a custom basePath inside `next.config.js`, you must also specify it here.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath?: string;
  /**
   * A locale to use if some keys aren't translated, to fallback to this locale instead of showing the translation key.
   */
  fallbackLocale?: Record<string, unknown>;
};
