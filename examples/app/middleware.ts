import { NextResponse } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

export const middleware = createI18nMiddleware(
  request => {
    console.log('User middleware:', request.url);
    return NextResponse.next();
  },
  {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    // urlMappingStrategy: 'rewrite',
  },
);

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
