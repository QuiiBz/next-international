import { NextResponse } from 'next/server';
import type { NextMiddleware, NextRequest } from 'next/server';

type I18nMiddlewareConfig<Locales extends readonly string[]> = {
  locales: Locales;
  defaultLocale: Locales[number];
  /**
   * When a url is not prefixed with a locale, this setting determines whether the middleware should perform a *redirect* or *rewrite* to the default locale.
   *
   * **redirect**: `https://example.com/products` -> *redirect* to `https://example.com/en/products` -> client sees the locale in the url
   *
   * **rewrite**: `https://example.com/products` -> *rewrite* to `https://example.com/en/products` -> client doesn't see the locale in the url
   *
   * **rewriteDefault**: `https://example.com/products` -> use *rewrite* for the default locale, *redirect* for all other locales
   *
   * @default redirect
   */
  urlMappingStrategy?: 'redirect' | 'rewrite' | 'rewriteDefault';
  /**
   * Override the resolution of a locale from a `Request`, which by default will try to extract it from the `Accept-Language` header. This can be useful to force the use of a specific locale regardless of the `Accept-Language` header.
   *
   * @description This function will only be called if the user doesn't already have a `Next-Locale` cookie.
   */
  resolveLocaleFromRequest?: (request: NextRequest) => string | null;
};

function getLocaleFromRequest<const Locales extends readonly string[]>(
  request: NextRequest,
  config: I18nMiddlewareConfig<Locales>,
) {
  if (config.resolveLocaleFromRequest) {
    return config.resolveLocaleFromRequest(request);
  }

  const locale = request.cookies.get('locale')?.value;

  if (!locale || !config.locales.includes(locale)) {
    return null;
  }

  return locale;
}

function noLocalePrefix(locales: readonly string[], pathname: string) {
  return locales.every(locale => {
    return !(pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  });
}

export function createI18nMiddleware<const Locales extends readonly string[]>(
  middleware: NextMiddleware,
  config: I18nMiddlewareConfig<Locales>,
): NextMiddleware {
  return async (request, event) => {
    let currentLocale = getLocaleFromRequest(request, config);

    if (currentLocale === null) {
      currentLocale = config.defaultLocale;
      const response = await middleware(request, event);

      if (response instanceof NextResponse) {
        response.cookies.set('locale', currentLocale, { sameSite: 'strict' });
      } else if (response instanceof Response) {
        const cookies = response.headers.get('set-cookie') ?? '';
        response.headers.set('set-cookie', `${cookies}; locale=${currentLocale}; SameSite=Strict`);
      }

      return response;
    }

    if (!config.urlMappingStrategy || config.urlMappingStrategy === 'redirect') {
      const nextUrl = request.nextUrl;
      const pathname = new URL(request.url).pathname;

      if (noLocalePrefix(config.locales, pathname)) {
        nextUrl.pathname = `/${currentLocale}${pathname}`;
        const response = NextResponse.redirect(nextUrl);
        return response;
      }
    }

    if (
      (config.urlMappingStrategy === 'rewriteDefault' && currentLocale === config.defaultLocale) ||
      config.urlMappingStrategy === 'rewrite'
    ) {
      const nextUrl = request.nextUrl;

      if (noLocalePrefix(config.locales, nextUrl.pathname)) {
        nextUrl.pathname = `/${currentLocale}${nextUrl.pathname}`;
        const response = NextResponse.rewrite(nextUrl);
        return response;
      }

      const urlWithoutLocale = nextUrl.pathname.slice(currentLocale.length + 1);
      const newUrl = new URL(urlWithoutLocale || '/', request.url);
      newUrl.search = nextUrl.search;

      const response = NextResponse.redirect(newUrl);
      return response;
    }

    return middleware(request, event);
  };
}
