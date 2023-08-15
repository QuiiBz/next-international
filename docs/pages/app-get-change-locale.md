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

export default function Page() {
  const locale = getCurrentLocale()

  return (
    <p>Current locale: {locale}</p>
  )
}
```

If you have set a [`basePath`](https://nextjs.org/docs/app/api-reference/next-config-js/basePath) option inside `next.config.js`, you'll also need to set it here:

```ts {2}
const changeLocale = useChangeLocale({
  basePath: '/your-base-path'
})
```

