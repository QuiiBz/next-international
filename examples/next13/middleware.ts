import { NextResponse, NextRequest } from 'next/server';

const locales = ['en', 'fr'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    locale => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    const acceptLanguage = request.headers.get('Accept-Language');
    const acceptLanguageLocale = acceptLanguage?.split(',')[0].split('-')[0] ?? 'en';
    const locale = locales.includes(acceptLanguageLocale) ? acceptLanguageLocale : 'en';

    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
