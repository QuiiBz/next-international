# Middleware configuration

## Rewrite the URL to hide the locale

You might have noticed that by default, next-international redirects and shows the locale in the URL (e.g `/en/products`). This is helpful for users, but you can transparently rewrite the URL to hide the locale (e.g `/products`).

Navigate to the `middleware.ts` file and set the `urlMappingStrategy` to `rewrite` (the default is `redirect`):

```ts {5}
// middleware.ts
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite'
})
```

You can also choose to only rewrite the URL for the default locale, and keep others locale in the URL (e.g use `/products` instead of `/en/products`, but keep `/fr/products`) using the `rewriteDefault` strategy:

```ts {5}
// middleware.ts
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewriteDefault'
})
```

## Override the user's locale resolution

If needed, you can override the resolution of a locale from a `Request`, which by default will try to extract it from the `Accept-Language` header. This can be useful to force the use of a specific locale regardless of the `Accept-Language` header. Note that this function will only be called if the user doesn't already have a `Next-Locale` cookie.

Navigate to the `middleware.ts` file and implement a new `resolveLocaleFromRequest` function:

```ts {5-8}
// middleware.ts
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  resolveLocaleFromRequest: request => {
    // Do your logic here to resolve the locale
    return 'fr'
  }
})
```

