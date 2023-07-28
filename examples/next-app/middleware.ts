import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest } from 'next/server';
import { defaultLocale, locales } from './locales/resources';

const I18nMiddleware = createI18nMiddleware(locales, defaultLocale);

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
