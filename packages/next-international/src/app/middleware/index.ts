import { NextRequest, NextResponse } from 'next/server';

const Response = NextResponse;

export function createI18nMiddleware<Locales extends readonly string[]>(
  locales: Locales,
  defaultLocale: Locales[number],
) {
  return function I18nMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const pathnameIsMissingLocale = locales.every(
      locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
    );

    if (pathnameIsMissingLocale && pathname !== '/favicon.ico') {
      let locale = request.cookies.get('Next-Locale')?.value;

      if (!locale) {
        const acceptLanguage = request.headers.get('Accept-Language');
        const acceptLanguageLocale = acceptLanguage?.split(',')?.[0]?.split('-')?.[0] ?? defaultLocale;

        locale = locales.includes(acceptLanguageLocale) ? acceptLanguageLocale : defaultLocale;
      }

      const response = Response.redirect(new URL(`/${locale}${pathname}`, request.url));

      response.headers.set('X-Next-Locale', locale);

      return response;
    }

    const response = Response.next();
    const locale = pathname.split('/')[1];

    if (locales.includes(locale)) {
      response.headers.set('X-Next-Locale', locale);
      response.cookies.set('Next-Locale', locale);
    }

    return response;
  };
}
