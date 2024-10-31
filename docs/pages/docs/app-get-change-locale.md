# Get and change the locale

You can only change the current locale from a Client Component. Export `useChangeLocale` and `useCurrentLocale` from `createI18nClient`, and export `getCurrentLocale` from `createI18nServer`:

```ts {3,4,12}
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

```tsx {6,7,11-13,22,25}
// Client Component
'use client'
import { useChangeLocale, useCurrentLocale } from '../../locales/client'

export default function Page() {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <>
      <p>Current locale: {locale}</p>
      <button onClick={() => changeLocale('en')}>English</button>
      <button onClick={() => changeLocale('fr')}>French</button>
    </>
  )
}

// Server Component
import { getCurrentLocale } from '../../locales/server'

export default async function Page() {
  // If you are using Next.js < 15, you don't need to await `getCurrentLocale`:
  // const locale = getCurrentLocale()
  const locale = await getCurrentLocale()

  return (
    <p>Current locale: {locale}</p>
  )
}
```

## Preserving search params

By default, next-international doesn't preserve search params when changing the locale. This is because [`useSearchParams()`](https://nextjs.org/docs/app/api-reference/functions/use-search-params) will [opt-out the page from Static Rendering](https://nextjs.org/docs/app/api-reference/functions/use-search-params#static-rendering) if you don't wrap the component in a `Suspense` boundary.

If you want to preserve search params, you can manually use the `preserveSearchParams` option inside `useChangeLocale`:

```tsx {6}
// Client Component
'use client'
import { useChangeLocale } from '../../locales/client'

export function ChangeLocaleButton() {
  const changeLocale = useChangeLocale({ preserveSearchParams: true })

  ...
}
```

Then, don't forget to wrap the component in a `Suspense` boundary to avoid opting out the entire page from Static Rendering:

```tsx {6-8}
// Client or Server Component
import { ChangeLocaleButton } from './change-locale-button'

export default function Page() {
  return (
    <Suspense>
      <ChangeLocaleButton />
    </Suspense>
  )
}
```

## `basePath` support

If you have set a [`basePath`](https://nextjs.org/docs/app/api-reference/next-config-js/basePath) option inside `next.config.js`, you'll also need to set it inside `createI18nClient`:

```ts {7}
// locales/client.ts
export const {
  ...
} = createI18nClient({
  ...
}, {
  basePath: '/base'
})
```

