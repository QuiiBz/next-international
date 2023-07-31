import { NextRequest, NextResponse } from 'next/server';

import { LOCALE_COOKIE, LOCALE_HEADER } from '../../common/constants';
import type { I18nMiddlewareConfig } from '../../types';
import { warn } from '../../helpers/log';

const DEFAULT_STRATEGY = 'redirect';

export function createI18nMiddleware<Locales extends readonly string[]>(
  locales: Locales,
  defaultLocale: Locales[number],
  config?: I18nMiddlewareConfig,
) {
  return function I18nMiddleware(request: NextRequest) {
    const requestUrl = request.nextUrl.clone();

    const locale = localeFromRequest(request) ?? defaultLocale;

    if (noLocalePrefix(locales, requestUrl.pathname)) {
      const mappedUrl = requestUrl.clone();
      mappedUrl.pathname = `/${locale}${mappedUrl.pathname}`;

      const strategy = config?.urlMappingStrategy ?? DEFAULT_STRATEGY;
      if (strategy === 'redirect') {
        const response = NextResponse.redirect(mappedUrl);
        return addLocaleToResponse(response, locale);
      } else if (strategy === 'rewrite') {
        const response = NextResponse.rewrite(mappedUrl);
        return addLocaleToResponse(response, locale);
      } else {
        warn(`Invalid urlMappingStrategy: ${strategy}. Defaulting to redirect.`);
        const response = NextResponse.redirect(mappedUrl);
        return addLocaleToResponse(response, locale);
      }
    }

    const response = NextResponse.next();
    return addLocaleToResponse(response, locale);
  };
}

function localeFromRequest(request: NextRequest) {
  let locale = request.cookies.get(LOCALE_COOKIE)?.value ?? null;
  if (!locale) {
    locale = negotiateAcceptLanguage(request);
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
