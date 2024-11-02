import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LOCALE_COOKIE, LOCALE_HEADER } from '../../common/constants';
import { warn } from '../../helpers/log';
import type { I18nMiddlewareConfig } from '../../types';

const DEFAULT_STRATEGY: NonNullable<I18nMiddlewareConfig<[]>['urlMappingStrategy']> = 'redirect';

export function createI18nMiddleware<const Locales extends readonly string[]>(config: I18nMiddlewareConfig<Locales>) {
  return function I18nMiddleware(request: NextRequest) {
    const locale = localeFromRequest(request, config);
    const nextUrl = request.nextUrl;

    const { cookieName, headerName } = config;

    // If the locale from the request is not an handled locale, then redirect to the same URL with the default locale
    if (noLocalePrefix(config.locales, nextUrl.pathname)) {
      nextUrl.pathname = `/${locale}${nextUrl.pathname}`;

      const strategy = config.urlMappingStrategy ?? DEFAULT_STRATEGY;
      if (strategy === 'rewrite' || (strategy === 'rewriteDefault' && locale === config.defaultLocale)) {
        const response = NextResponse.rewrite(nextUrl);
        return addLocaleToResponse(request, response, locale, { cookieName, headerName });
      } else {
        if (!['redirect', 'rewriteDefault'].includes(strategy)) {
          warn(`Invalid urlMappingStrategy: ${strategy}. Defaulting to redirect.`);
        }

        const response = NextResponse.redirect(nextUrl);
        return addLocaleToResponse(request, response, locale, { cookieName, headerName });
      }
    }

    let response = NextResponse.next();
    const pathnameLocale = nextUrl.pathname.split('/', 2)?.[1];

    if (!pathnameLocale || config.locales.includes(pathnameLocale)) {
      // If the URL mapping strategy is set to 'rewrite' and the locale from the request doesn't match the locale in the pathname,
      // or if the URL mapping strategy is set to 'rewriteDefault' and the locale from the request doesn't match the locale in the pathname
      // or is the same as the default locale, then proceed with the following logic
      if (
        (config.urlMappingStrategy === 'rewrite' && pathnameLocale !== locale) ||
        (config.urlMappingStrategy === 'rewriteDefault' &&
          (pathnameLocale !== locale || pathnameLocale === config.defaultLocale))
      ) {
        // Remove the locale from the pathname
        const pathnameWithoutLocale = nextUrl.pathname.slice(pathnameLocale.length + 1);

        // Create a new URL without the locale in the pathname
        const newUrl = new URL(pathnameWithoutLocale || '/', request.url);

        // Preserve the original search parameters
        newUrl.search = nextUrl.search;
        response = NextResponse.redirect(newUrl);
      }

      return addLocaleToResponse(request, response, pathnameLocale ?? config.defaultLocale, { cookieName, headerName });
    }

    return response;
  };
}

/**
 * Retrieve locale header from request and check if it is an handled locale.
 */
function localeFromRequest<Locales extends readonly string[]>(
  request: NextRequest,
  config: I18nMiddlewareConfig<Locales>,
) {
  const {
    locales,
    defaultLocale,
    cookieName = LOCALE_COOKIE,
    resolveLocaleFromRequest = defaultResolveLocaleFromRequest,
  } = config;

  const locale = request.cookies.get(cookieName)?.value ?? resolveLocaleFromRequest(request);

  if (!locale || !locales.includes(locale)) {
    return defaultLocale;
  }

  return locale;
}

/**
 * Default implementation of the `resolveLocaleFromRequest` function for the I18nMiddlewareConfig.
 * This function extracts the locale from the 'Accept-Language' header of the request.
 */
const defaultResolveLocaleFromRequest: NonNullable<
  I18nMiddlewareConfig<ReadonlyArray<string>>['resolveLocaleFromRequest']
> = request => {
  const header = request.headers.get('Accept-Language');
  const locale = header?.split(',', 1)?.[0]?.split('-', 1)?.[0];
  return locale ?? null;
};

/**
 * Returns `true` if the pathname does not start with an handled locale
 */
function noLocalePrefix(locales: readonly string[], pathname: string) {
  return locales.every(locale => {
    return !(pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  });
}

/**
 * Add locale header (default `X-Next-Locale`) and cookie (default `Next-Locale`) to response
 *
 * Header and cookie names can be customized using the `headerName` and `cookieName` options in the I18nMiddlewareConfig.
 *
 * **NOTE:** The cookie is only set if the locale is different from the one in the cookie
 */
function addLocaleToResponse<const Locales extends readonly string[]>(
  request: NextRequest,
  response: NextResponse,
  locale: string,
  options?: Partial<Pick<I18nMiddlewareConfig<Locales>, 'cookieName' | 'headerName'>>,
) {
  const { cookieName = LOCALE_COOKIE, headerName = LOCALE_HEADER } = options ?? {};

  response.headers.set(headerName, locale);

  if (request.cookies.get(cookieName)?.value !== locale) {
    response.cookies.set(cookieName, locale, { sameSite: 'strict' });
  }
  return response;
}
