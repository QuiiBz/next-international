import { NextRequest, NextResponse } from 'next/server';

export function createI18nMiddleware<Locales extends string[]>(locales: Locales, defaultLocale: Locales[number]) {
  return function I18nMiddleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const pathnameIsMissingLocale = locales.every(
      locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
    );

    if (pathnameIsMissingLocale && pathname !== '/favicon.ico') {
      const acceptLanguage = request.headers.get('Accept-Language');
      const acceptLanguageLocale = acceptLanguage?.split(',')?.[0]?.split('-')?.[0] ?? defaultLocale;

      const locale = locales.includes(acceptLanguageLocale) ? acceptLanguageLocale : defaultLocale;

      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }
  };
}
