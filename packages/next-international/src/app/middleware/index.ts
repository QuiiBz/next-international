import { NextRequest, NextResponse } from 'next/server';

import { LOCALE_COOKIE, LOCALE_HEADER } from '../../common/constants';
import type { I18nMiddlewareConfig } from '../../types';
import { warn } from '../../helpers/log';

const DEFAULT_STRATEGY: NonNullable<I18nMiddlewareConfig['urlMappingStrategy']> = 'redirect';

export function createI18nMiddleware<Locales extends readonly string[]>(
  locales: Locales,
  defaultLocale: Locales[number],
  config?: I18nMiddlewareConfig,
) {
  return function I18nMiddleware(request: NextRequest) {
    const requestUrl = request.nextUrl.clone();

    const locale = localeFromRequest(locales, request) ?? defaultLocale;

    if (noLocalePrefix(locales, requestUrl.pathname)) {
      const mappedUrl = requestUrl.clone();
      mappedUrl.pathname = `/${locale}${mappedUrl.pathname}`;

      const strategy = config?.urlMappingStrategy ?? DEFAULT_STRATEGY;

      if (strategy === 'rewrite') {
        const response = NextResponse.rewrite(mappedUrl);
        return addLocaleToResponse(response, locale);
      } else {
        if (strategy !== 'redirect') {
          warn(`Invalid urlMappingStrategy: ${strategy}. Defaulting to redirect.`);
        }

        const response = NextResponse.redirect(mappedUrl);
        return addLocaleToResponse(response, locale);
      }
    }

    const response = NextResponse.next();
    const requestLocale = request.nextUrl.pathname.split('/')?.[1] ?? locale;

    if (locales.includes(requestLocale)) {
      return addLocaleToResponse(response, requestLocale);
    }

    return response;
  };
}

function localeFromRequest(locales: readonly string[], request: NextRequest) {
  let locale = request.cookies.get(LOCALE_COOKIE)?.value ?? null;

  if (!locale) {
    locale = negotiateAcceptLanguage(request);
  }

  if (!locale || !locales.includes(locale)) {
    locale = null;
  }

  return locale;
}

function negotiateAcceptLanguage(request: NextRequest) {
  const header = request.headers.get('Accept-Language');
  const locale = header?.split(',')?.[0]?.split('-')?.[0];
  return locale ?? null;
}

function noLocalePrefix(locales: readonly string[], pathname: string) {
  return locales.every(locale => !pathname.startsWith(`/${locale}`));
}

function addLocaleToResponse(response: NextResponse, locale: string) {
  response.headers.set(LOCALE_HEADER, locale);
  response.cookies.set(LOCALE_COOKIE, locale);
  return response;
}
