import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { LOCALE_COOKIE, LOCALE_HEADER } from '../../common/constants';
import { warn } from '../../helpers/log';
import type { I18nMiddlewareConfig } from '../../types';

const DEFAULT_STRATEGY: NonNullable<I18nMiddlewareConfig<[]>['urlMappingStrategy']> = 'redirect';

export function createI18nMiddleware<const Locales extends readonly string[]>(config: I18nMiddlewareConfig<Locales>) {
  return function I18nMiddleware(request: NextRequest) {
    const requestUrl = request.nextUrl.clone();
    const locale = localeFromRequest(config.locales, request, config.resolveLocaleFromRequest) ?? config.defaultLocale;

    if (noLocalePrefix(config.locales, requestUrl.pathname)) {
      requestUrl.pathname = `/${locale}${requestUrl.pathname}`;

      const strategy = config.urlMappingStrategy ?? DEFAULT_STRATEGY;
      if (strategy === 'rewrite' || (strategy === 'rewriteDefault' && locale === config.defaultLocale)) {
        const response = NextResponse.rewrite(requestUrl);
        return addLocaleToResponse(request, response, locale);
      } else {
        if (!['redirect', 'rewriteDefault'].includes(strategy)) {
          warn(`Invalid urlMappingStrategy: ${strategy}. Defaulting to redirect.`);
        }

        const response = NextResponse.redirect(requestUrl);
        return addLocaleToResponse(request, response, locale);
      }
    }

    let response = NextResponse.next();
    const requestLocale = request.nextUrl.pathname.split('/')?.[1];

    if (!requestLocale || config.locales.includes(requestLocale)) {
      if (
        (config.urlMappingStrategy === 'rewrite' || config.urlMappingStrategy === 'rewriteDefault') &&
        requestLocale !== locale
      ) {
        const pathnameWithoutLocale = request.nextUrl.pathname.slice(requestLocale.length + 1);
        const newUrl = new URL(pathnameWithoutLocale === '' ? '/' : pathnameWithoutLocale, request.url);
        newUrl.search = request.nextUrl.search;
        response = NextResponse.redirect(newUrl);
      }

      if (config.urlMappingStrategy === 'rewriteDefault' && requestLocale === config.defaultLocale) {
        const pathnameWithoutLocale = request.nextUrl.pathname.slice(requestLocale.length + 1);
        const newUrl = new URL(pathnameWithoutLocale === '' ? '/' : pathnameWithoutLocale, request.url);
        newUrl.search = request.nextUrl.search;
        response = NextResponse.redirect(newUrl);
      }

      return addLocaleToResponse(request, response, requestLocale ?? config.defaultLocale);
    }

    return response;
  };
}

/**
 * Retrieve `Next-Locale` header from request
 * and check if it is an handled locale.
 */
function localeFromRequest<Locales extends readonly string[]>(
  locales: Locales,
  request: NextRequest,
  resolveLocaleFromRequest: NonNullable<
    I18nMiddlewareConfig<Locales>['resolveLocaleFromRequest']
  > = defaultResolveLocaleFromRequest,
) {
  let locale = request.cookies.get(LOCALE_COOKIE)?.value ?? null;

  if (!locale) {
    locale = resolveLocaleFromRequest(request);
  }

  if (!locale || !locales.includes(locale)) {
    locale = null;
  }

  return locale;
}

/**
 * Default implementation of the `resolveLocaleFromRequest` function for the I18nMiddlewareConfig.
 * This function extracts the locale from the 'Accept-Language' header of the request.
 */
const defaultResolveLocaleFromRequest: NonNullable<I18nMiddlewareConfig<any>['resolveLocaleFromRequest']> = request => {
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
 * Add `X-Next-Locale` header and `Next-Locale` cookie to response
 * and copy all cookies from request to response
 */
function addLocaleToResponse(request: NextRequest, response: NextResponse, locale: string) {
  response.headers.set(LOCALE_HEADER, locale);
  response.cookies.set(LOCALE_COOKIE, locale);

  // Apply cookies from request to response
  const cookies = request.cookies;
  for (const [, value] of cookies) {
    if (value.name !== LOCALE_COOKIE) {
      response.cookies.set(value.name, value.value);
    }
  }
  return response;
}
