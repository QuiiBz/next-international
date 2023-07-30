import type { BaseLocale, LocaleValue, Params } from 'international-types';
import type { NextRequest } from 'next/server';

export type LocaleContext<Locale extends BaseLocale> = {
  locale: string;
  localeContent: Locale;
  fallbackLocale?: Locale;
};

export type LocaleMap<T> = Record<keyof T, React.ReactNode>;

export type ReactParamsObject<Value extends LocaleValue> = Record<Params<Value>[number], React.ReactNode>;

export type I18NProviderConfig = {
  /**
   * The name of the Next.js layout segment param that will be used to determine the locale in a client component.
   *
   * An app directory folder hierarchy that looks like `app/[locale]/products/[category]/[subCategory]/page.tsx` would be `locale`.
   *
   * Default is `locale`
   */
  segmentName?: string;
};

export type I18NMiddlewareConfig = {
  /**
   * When a url is not prefixed with a locale, this setting determines whether the middleware should perform a *redirect* or *rewrite* to the default locale.
   *
   * **redirect**: `https://example.com/products` -> *redirect* to `https://example.com/en/products` -> client sees the locale in the url
   *
   * **rewrite**: `https://example.com/products` -> *rewrite* to `https://example.com/en/products` -> client doesn't see the locale in the url
   *
   * Default is `redirect`
   */
  urlMappingStrategy?: 'redirect' | 'rewrite';

  /**
   * Specify a custom function to determine the locale from the request headers. It is recommended to use a standard content negotiation library like [negotiator](https://www.npmjs.com/package/negotiator) or [accept-negotiator](@fastify/accept-negotiator).
   *  If the function returns `null`, the default locale will be used.
   *
   * The default implementation will look at the `Accept-Language` header and return the first locale.
   *
   * Example:
   *
   * ```ts
   * import { negotiate } from "@fastify/accept-negotiator"
   *
   * const locales = ['en', 'fr'] as const
   * const defaultLocale = 'fr'
   * const I18nMiddleware = createI18nMiddleware(locales, defaultLocale, {
   *  contentNegotiation: (request, locales) => {
   *    const header = request.headers.get('Accept-Language') || ""
   *    return negotiate(header, locales)
   *  }
   * })
   * ```
   */
  contentNegotiator?: (request: NextRequest, locales: readonly string[]) => string | null;
};
