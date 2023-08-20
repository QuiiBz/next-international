# Middleware configuration

## Rewrite the URL to hide the locale

You might have noticed that by default, next-international redirects and shows the locale in the URL (e.g `/en/products`). This is helpful for users, but you can transparently rewrite the URL to hide the locale (e.g `/products`).

Navigate to the `middleware.ts` file and set the `urlMappingStrategy` to `rewrite` (the default is `redirect`):

```ts
// middleware.ts
const I18nMiddleware = createI18nMiddleware(
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  urlMappingStrategy: 'rewrite'
})
```

## Override the user's locale resolution

If needed, you can override the resolution of a locale from a `Request`, which by default will try to extract it from the `Accept-Language` header. This can be useful to force the use of a specific locale regardless of the `Accept-Language` header. Note that this function will only be called if the user doesn't already have a `Next-Locale` cookie.

Navigate to the `middleware.ts` file and implement a new `resolveLocaleFromRequest` function:

```ts
// middleware.ts
const I18nMiddleware = createI18nMiddleware(
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  resolveLocaleFromRequest: request => {
    // Do your logic here to resolve the locale
    return 'fr'
  }
})
```

