import type { BaseLocale, LocaleValue, Params } from 'international-types';

export type LocaleContext<Locale extends BaseLocale> = {
  locale: string;
  localeContent: Locale;
  fallbackLocale?: Locale;
};

export type LocaleMap<T> = Record<keyof T, React.ReactNode>;

export type ReactParamsObject<Value extends LocaleValue> = Record<Params<Value>[number], React.ReactNode>;

export type I18nCurrentLocaleConfig = {
  /**
   * The name of the Next.js layout segment param that will be used to determine the locale in a client component.
   *
   * An app directory folder hierarchy that looks like `app/[locale]/products/[category]/[subCategory]/page.tsx` would be `locale`.
   *
   * @default locale
   */
  segmentName?: string;
};

export type I18nChangeLocaleConfig = {
  /**
   * If you are using a custom basePath inside `next.config.js`, you must also specify it here.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath?: string;
};

export type I18nMiddlewareConfig = {
  /**
   * When a url is not prefixed with a locale, this setting determines whether the middleware should perform a *redirect* or *rewrite* to the default locale.
   *
   * **redirect**: `https://example.com/products` -> *redirect* to `https://example.com/en/products` -> client sees the locale in the url
   *
   * **rewrite**: `https://example.com/products` -> *rewrite* to `https://example.com/en/products` -> client doesn't see the locale in the url
   *
   * @default redirect
   */
  urlMappingStrategy?: 'redirect' | 'rewrite';

  /**
   * Force to use the default locale instead of trying to extract the user's preferred locale.
   *
   * @default false
   */
  forceDefaultLocale?: boolean;
};
