import { NextResponse } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';

export const middleware = createI18nMiddleware(request => {
  return NextResponse.next();
});

export const config = {
  matcher: ['/', '/:locale'],
};
