// @vitest-environment node

import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { createI18nMiddleware } from '../src/app/middleware';

const middleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  urlMappingStrategy: 'rewriteDefault',
});

describe('createI18nMiddleware with rewriteDefault', () => {
  it.each(['/en', '/en/products?sort=price'])('should keep the non-default locale in %s without cookies', path => {
    const response = middleware(new NextRequest(`https://example.com${path}`));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-rewrite')).toBeNull();
    expect(response.headers.get('x-middleware-next')).toBe('1');
    expect(response.headers.get('X-Next-Locale')).toBe('en');
    expect(response.cookies.get('Next-Locale')?.value).toBe('en');
  });

  it.each([
    ['Accept-Language', 'fr'],
    ['Cookie', 'Next-Locale=fr'],
  ])('should keep the non-default locale when %s is %s', (header, value) => {
    const response = middleware(
      new NextRequest('https://example.com/en/products?sort=price', { headers: { [header]: value } }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('X-Next-Locale')).toBe('en');
    expect(response.cookies.get('Next-Locale')?.value).toBe('en');
  });

  it('should not replace a matching locale cookie', () => {
    const request = new NextRequest('https://example.com/en');
    request.cookies.set('Next-Locale', 'en');
    const response = middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('X-Next-Locale')).toBe('en');
    expect(response.headers.get('set-cookie')).toBeNull();
  });

  it.each([
    ['/fr', '/'],
    ['/fr/products?sort=price', '/products?sort=price'],
  ])('should remove the default locale from %s', (path, destination) => {
    const request = new NextRequest(`https://example.com${path}`);
    request.cookies.set('Next-Locale', 'en');
    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(`https://example.com${destination}`);
    expect(response.headers.get('X-Next-Locale')).toBe('fr');
    expect(response.cookies.get('Next-Locale')?.value).toBe('fr');
  });
});
