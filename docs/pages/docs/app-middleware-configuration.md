# Middleware configuration

## Rewrite the URL to hide the locale

You might have noticed that by default, next-international redirects and shows the locale in the URL (e.g `/en/products`). This is helpful for users, but you can transparently rewrite the URL to hide the locale (e.g `/products`).

Navigate to the `middleware.ts` file and set the `urlMappingStrategy` to `rewrite` (the default is `redirect`):

```ts {5}
// middleware.ts
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewrite',
});
```

You can also choose to only rewrite the URL for the default locale, and keep others locale in the URL (e.g use `/products` instead of `/en/products`, but keep `/fr/products`) using the `rewriteDefault` strategy:

```ts {5}
// middleware.ts
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  urlMappingStrategy: 'rewriteDefault',
});
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
    return 'fr';
  },
});
```

## Customizing Locale Cookie Name

By default, next-international sets the user's selected locale in a cookie named `Next-Locale`. If your application requires a different naming convention for cookies, you can specify a custom name for this cookie. This customization can be particularly useful for aligning with your project's naming guidelines or avoiding conflicts with existing cookies.

To change the locale cookie name, adjust your `middleware.ts` configuration as follows:

```ts {5}
// middleware.ts
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  cookieName: 'NEXT_LOCALE',
});
```

This setting allows you to seamlessly integrate the internationalization middleware with your application's existing infrastructure, enhancing both flexibility and consistency.

## Customizing Locale Header Name

Next-international approach also involves setting an HTTP header (`X-Next-Locale`) to reflect the current user's locale. In certain scenarios, you might need to customize this header's name — whether to comply with your API's standards, to integrate with third-party services more effectively, or simply to maintain consistency across your headers.

For customizing the locale header name, update your `middleware.ts` file as illustrated below:

```ts {5}
// middleware.ts
const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  headerName: 'X-Locale',
});
```
