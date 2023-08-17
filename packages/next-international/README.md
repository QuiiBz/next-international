<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/QuiiBz/next-international/blob/main/assets/logo-white.png">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/QuiiBz/next-international/blob/main/assets/logo-black.png" />
    <img alt="" height="100px" src="https://github.com/QuiiBz/next-international/blob/main/assets/logo-white.png">
  </picture>
  <br />
  Type-safe internationalization (i18n) for Next.js
</p>

---

- [Features](#features)
- [Usage](#usage)
  - [Pages Router](#pages-router)
  - [App Router](#app-router)
- [Examples](#examples)
  - [Scoped translations](#scoped-translations)
  - [Plurals](#plurals)
  - [Nested objects locales](#nested-objects-locales)
  - [Change and get current locale](#change-and-get-current-locale)
  - [Fallback locale for missing translations](#fallback-locale-for-missing-translations)
  - [Load initial locales client-side](#load-initial-locales-client-side)
  - [Rewrite the URL to hide the locale](#rewrite-the-url-to-hide-the-locale)
  - [Override the user's locale resolution](#override-the-users-locale-resolution)
  - [Use the types for my own library](#use-the-types-for-my-own-library)
  - [Testing](#testing)
- [License](#license)

## Features

- **100% Type-safe**: Locales in TS or JSON, type-safe `t()` & `scopedT()`, type-safe params, type-safe plurals, type-safe `changeLocale()`...
- **Small**: No dependencies, lazy-loaded
- **Simple**: No Webpack configuration, no CLI, no code generation, just pure TypeScript
- **SSR/SSG/CSR**: Load only the required locale, client-side and server-side
- **Pages or App Router**: With support for React Server Components

> **Note**: You can now build on top of the types used by next-international using [international-types](https://github.com/QuiiBz/next-international/tree/main/packages/international-types)!

[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/jovial-paper-skkprk?file=%2Fapp%2F%5Blocale%5D%2Fpage.tsx%3A1%2C1)

## Usage

```bash
pnpm install next-international
```

Make sure that `strict` is set to `true` in your `tsconfig.json`, then follow the guide for the [Pages Router](#pages-router) or the [App Router](#app-router).

You can also find complete examples inside the [examples/next-pages](./examples/next-pages/) and [examples/next-app](./examples/next-app/) directories.

### Pages Router

1. Make sure that you've set up correctly the [`i18n` key inside `next.config.js`](https://nextjs.org/docs/pages/building-your-application/routing/internationalization), then create `locales/index.ts` with your locales:

```ts
// locales/index.ts
import { createI18n } from 'next-international'

export const { useI18n, useScopedI18n, I18nProvider, getLocaleProps } = createI18n({
  en: () => import('./en'),
  fr: () => import('./fr')
})
```

Each locale file should export a default object (don't forget `as const`):

```ts
// locales/en.ts
export default {
  'hello': 'Hello',
  'hello.world': 'Hello world!',
  'welcome': 'Hello {name}!'
} as const
```

2. Wrap your whole app with `I18nProvider` inside `_app.tsx`:

```tsx
// pages/_app.tsx
import { I18nProvider } from '../locales'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider locale={pageProps.locale}>
      <Component {...pageProps} />
    </I18nProvider>
  )
}
```

3. Add `getLocaleProps` to your pages, or wrap your existing `getStaticProps` (this will allow to SSR locales, see [Load initial locales client-side](#load-initial-locales-client-side) if you want to load the initial locale client-side):

```ts
// pages/index.tsx
export const getStaticProps = getLocaleProps()

// or with an existing `getStaticProps` function:
export const getStaticProps = getLocaleProps(ctx => {
  // your existing code
  return {
    ...
  }
})
```

If you already have `getServerSideProps` on this page, you can't use `getStaticProps`. In this case, you can still use `getLocaleProps` the same way:

```ts
// pages/index.tsx
export const getServerSideProps = getLocaleProps()

// or with an existing `getServerSideProps` function:
export const getServerSideProps = getLocaleProps(ctx => {
  // your existing code
  return {
    ...
  }
})
```

4. Use `useI18n` and `useScopedI18n()`:

```tsx
// pages/index.ts
import { useI18n, useScopedI18n } from '../locales'

// export const getStaticProps = ...
// export const getServerSideProps = ...

export default function Page() {
  const t = useI18n()
  const scopedT = useScopedI18n('hello')

  return (
    <div>
      <p>{t('hello')}</p>

      {/* Both are equivalent: */}
      <p>{t('hello.world')}</p>
      <p>{scopedT('world')}</p>

      <p>{t('welcome', { name: 'John' })}</p>
      <p>{t('welcome', { name: <strong>John</strong> })}</p>
    </div>
  )
}
```

### App Router

1. Create `locales/client.ts` and `locales/server.ts` with your locales:

```ts
// locales/client.ts
import { createI18nClient } from 'next-international/client'

export const { useI18n, useScopedI18n, I18nProviderClient } = createI18nClient({
  en: () => import('./en'),
  fr: () => import('./fr')
})

// locales/server.ts
import { createI18nServer } from 'next-international/server'

export const { getI18n, getScopedI18n, getStaticParams } = createI18nServer({
  en: () => import('./en'),
  fr: () => import('./fr')
})
```

Each locale file should export a default object (don't forget `as const`):

```ts
// locales/en.ts
export default {
  'hello': 'Hello',
  'hello.world': 'Hello world!',
  'welcome': 'Hello {name}!'
} as const
```

2. Move all your routes inside an `app/[locale]/` folder. For Client Components, wrap the lowest parts of your app with `I18nProviderClient` inside a layout:

```tsx
// app/[locale]/client/layout.tsx
import { ReactElement } from 'react'
import { I18nProviderClient } from '../../locales/client'

export default function SubLayout({
  children,
  params
}: {
  children: ReactElement
  params: { locale: string }
}) {
  return (
    <I18nProviderClient locale={params.locale}>
      {children}
    </I18nProviderClient>
  )
}
```

3. (WIP) If you want to support SSG with `output: export`, add `getStaticParams` to your pages:

```ts
// app/[locale]/page.tsx
import { ..., getStaticParams } from '../../locales/server'

export const generateStaticParams = getStaticParams()
```

4. Add a `middleware.ts` file at the root of your app, that will redirect the user to the right locale. You can also [rewrite the URL to hide the locale](#rewrite-the-url-to-hide-the-locale):

```ts
// middleware.ts
import { createI18nMiddleware } from 'next-international/middleware'
import { NextRequest } from 'next/server'

const I18nMiddleware = createI18nMiddleware(['en', 'fr'] as const, 'fr')

export function middleware(request: NextRequest) {
  return I18nMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
}
```

5. Use `useI18n` and `useScopedI18n()` / `getI18n` and `getScopedI18n()` inside your components:

```tsx
// Client Component
'use client'
import { useI18n, useScopedI18n } from '../../locales/client'

export default function Page() {
  const t = useI18n()
  const scopedT = useScopedI18n('hello')

  return (
    <div>
      <p>{t('hello')}</p>

      {/* Both are equivalent: */}
      <p>{t('hello.world')}</p>
      <p>{scopedT('world')}</p>

      <p>{t('welcome', { name: 'John' })}</p>
      <p>{t('welcome', { name: <strong>John</strong> })}</p>
    </div>
  )
}

// Server Component
import { getI18n, getScopedI18n } from '../../locales/server'

export default async function Page() {
  const t = await getI18n()
  const scopedT = await getScopedI18n('hello')

  return (
    <div>
      <p>{t('hello')}</p>

      {/* Both are equivalent: */}
      <p>{t('hello.world')}</p>
      <p>{scopedT('world')}</p>

      <p>{t('welcome', { name: 'John' })}</p>
      <p>{t('welcome', { name: <strong>John</strong> })}</p>
    </div>
  )
}
```

## Examples

### Scoped translations

When you have a lot of keys, you may notice in a file that you always use and duplicate the same scope:

```ts
// We always repeat `pages.settings`
t('pages.settings.title')
t('pages.settings.description', { identifier })
t('pages.settings.cta')
```

We can avoid this using the `useScopedI18n` hook / `getScopedI18n` method. And of course, the scoped key, subsequent keys and params will still be 100% type-safe.

<details>
<summary>Pages Router</summary>

Export `useScopedI18n` from `createI18n`:

```ts
// locales/index.ts
export const {
  useScopedI18n,
  ...
} = createI18n({
  ...
})
```

Then use it in your component:

```tsx
import { useScopedI18n } from '../locales'

export default function Page() {
  const t = useScopedI18n('pages.settings')

  return (
    <div>
      <p>{t('title')}</p>
      <p>{t('description', { identifier })}</p>
      <p>{t('cta')}</p>
    </div>
  )
}
```

</details>

<details>
<summary>App Router</summary>

Export `useScopedI18n` from `createI18nClient` and `getScopedI18n` from `createI18nServer`:

```ts
// locales/client.ts
export const {
  useScopedI18n,
  ...
} = createI18nClient({
  ...
})

// locales/server.ts
export const {
  getScopedI18n,
  ...
} = createI18nServer({
  ...
})
```

Then use it in your components:

```tsx
// Client Component
'use client'
import { useScopedI18n } from '../../locales/client'

export default function Page() {
  const t = useScopedI18n('pages.settings')

  return (
    <div>
      <p>{t('title')}</p>
      <p>{t('description', { identifier })}</p>
      <p>{t('cta')}</p>
    </div>
  )
}

// Server Component
import { getScopedI18n } from '../../locales/server'

export default async function Page() {
  const t = await getScopedI18n('pages.settings')

  return (
    <div>
      <p>{t('title')}</p>
      <p>{t('description', { identifier })}</p>
      <p>{t('cta')}</p>
    </div>
  )
}
```

</details>

### Plurals

Plural translations work out of the box without any external dependencies, using the [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API, which is supported in all browsers and Node.js.

To declare plural translations, append `#` followed by `zero`, `one`, `two`, `few`, `many` or `other`:

```ts
// locales/en.ts
export default {
  'cows#one': 'A cow',
  'cows#other': '{count} cows'
} as const
```

The correct translation will then be determined automatically using a mandatory `count` parameter. The value of `count` is determined by the union of all suffixes, enabling type safety:

- `zero` allows 0
- `one` autocompletes 1, 21, 31, 41... but allows any number
- `two` autocompletes 2, 22, 32, 42... but allows any number
- `few`, `many` and `other` allow any number

This works with the Pages Router, App Router in both Client and Server Components, and with [scoped translations](#scoped-translations):

```tsx
export default function Page() {
  const t = useI18n()

  return (
    <div>
      {/* Output: A cow */}
      <p>{t('cows', { count: 1 })}</p>
      {/* Output: 3 cows */}
      <p>{t('cows', { count: 3 })}</p>
    </div>
  )
}
```

### Nested objects locales

You can write locales using nested objects instead of the default dot notation. You can use the syntax you prefer without updating anything else:

```ts
// locales/en.ts
export default {
  hello: {
    world: 'Hello world!',
    nested: {
      translations: 'Translations'
    }
  }
} as const
```

It's the equivalent of the following:

```ts
// locales/en.ts
export default {
  'hello.world': 'Hello world!',
  'hello.nested.translations': 'Translations'
} as const
```

### Change and get current locale

<details>
<summary>Pages Router</summary>

Export `useChangeLocale` and `useCurrentLocale` from `createI18n`:

```ts
// locales/index.ts
export const {
  useChangeLocale,
  useCurrentLocale,
  ...
} = createI18n({
  ...
})
```

Then use it as a hook:

```tsx
import { useChangeLocale, useCurrentLocale } from '../locales'

export default function Page() {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <>
      <p>Current locale: <span>{locale}</span></p>
      <button onClick={() => changeLocale('en')}>English</button>
      <button onClick={() => changeLocale('fr')}>French</button>
    <>
  )
}
```

</details>


<details>
<summary>App Router</summary>

You can only change the current locale from a Client Component. Export `useChangeLocale` and `useCurrentLocale` from `createI18nClient` / `getCurrentLocale` from `createI18nServer`:

```ts
// locales/client.ts
export const {
  useChangeLocale,
  useCurrentLocale,
  ...
} = createI18nClient({
  ...
})

// locales/server.ts
export const {
  getCurrentLocale,
  ...
} = createI18nServer({
  ...
})
```

Then use these hooks:

```tsx
// Client Component
'use client'
import { useChangeLocale, useCurrentLocale } from '../../locales/client'

export default function Page() {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <>
      <p>Current locale: <span>{locale}</span></p>
      <button onClick={() => changeLocale('en')}>English</button>
      <button onClick={() => changeLocale('fr')}>French</button>
    <>
  )
}

// Server Component
import { getCurrentLocale } from '../../locales/server'

export default function Page() {
  const locale = getCurrentLocale()

  return (
    <p>Current locale: <span>{locale}</span></p>
  )
}
```

If you have set a [`basePath`](https://nextjs.org/docs/app/api-reference/next-config-js/basePath) option inside `next.config.js`, you'll also need to set it here:

```ts
const changeLocale = useChangeLocale({
  basePath: '/your-base-path'
})
```

</details>

### Fallback locale for missing translations

It's common to have missing translations in an application. By default, next-international outputs the key when no translation is found for the current locale, to avoid sending users unnecessary data.

You can provide a fallback locale that will be used for all missing translations:

```tsx
// pages/_app.tsx
import { I18nProvider } from '../locales'
import en from '../locales/en'

<I18nProvider locale={pageProps.locale} fallbackLocale={en}>
  ...
</I18nProvider>
```

### Load initial locales client-side

> **Warning**: This should not be used unless you know what you're doing and what that implies.

If for x reason you don't want to SSR the initial locale, you can load it on the client. Simply remove the `getLocaleProps` from your pages.

You can also provide a fallback component while waiting for the initial locale to load inside `I18nProvider`:

```tsx
<I18nProvider locale={pageProps.locale} fallback={<p>Loading locales...</p>}>
  ...
</I18nProvider>
```

### Rewrite the URL to hide the locale

You might have noticed that by default, next-international redirects and shows the locale in the URL (e.g `/en/products`). This is helpful for users, but you can transparently rewrite the URL to hide the locale (e.g `/products`).

Navigate to the `middleware.ts` file and set the `urlMappingStrategy` to `rewrite` (the default is `redirect`):

```ts
// middleware.ts
const I18nMiddleware = createI18nMiddleware(['en', 'fr'] as const, 'fr', {
  urlMappingStrategy: 'rewrite'
})
```

### Override the user's locale resolution

If needed, you can override the resolution of a locale from a `Request`, which by default will try to extract it from the `Accept-Language` header. This can be useful to force the use of a specific locale regardless of the `Accept-Language` header. Note that this function will only be called if the user doesn't already have a `Next-Locale` cookie.

Navigate to the `middleware.ts` file and implement a new `resolveLocaleFromRequest` function:

```ts
// middleware.ts
const I18nMiddleware = createI18nMiddleware(['en', 'fr'] as const, 'fr', {
  resolveLocaleFromRequest: request => {
    // Do your logic here to resolve the locale
    return 'fr'
  }
})
```

### Use the types for my own library

We also provide a separate package called [international-types](https://github.com/QuiiBz/next-international/tree/main/packages/international-types) that contains the utility types for next-international. You can build a library on top of it and get the same awesome type-safety.

### Testing

In case you want to make tests with next-international, you will need to create a custom render. The following example uses `@testing-library` and `Vitest`, but should work with `Jest` too.

<details>
<summary>Testing example</summary>

```tsx
// customRender.tsx
import { ReactElement } from 'react'
import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }
```

You will also need your locales files, or one for testing purposes.

```ts
// en.ts
export default {
  hello: 'Hello',
} as const
```

Then, you can later use it in your tests:

```tsx
// *.test.tsx
import { describe, vi } from 'vitest'
import { createI18n } from 'next-international'
import { render, screen, waitFor } from './customRender' // Our custom render function.
import en from './en' // Your locales.

// Don't forget to mock the "next/router", not doing this may lead to some console errors.
beforeEach(() => {
  vi.mock('next/router', () => ({
    useRouter: vi.fn().mockImplementation(() => ({
      locale: 'en',
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    })),
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Example test', () => {
  it('just an example', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./en'),
    })

    function App() {
      const t = useI18n()

      return <p>{t('hello')}</p>
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>
    )

    expect(screen.queryByText('Hello')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })
  })
})
```

</details>

## Sponsors

![Sponsors](https://github.com/QuiiBz/next-international/blob/main/assets/sponsors.svg)

## License

[MIT](./LICENSE)
