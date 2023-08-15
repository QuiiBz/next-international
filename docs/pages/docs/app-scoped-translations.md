When you have a lot of keys, you may notice in a file that you always use and duplicate the same scope:

```ts
// We always repeat `pages.settings`
t('pages.settings.title')
t('pages.settings.description', { identifier })
t('pages.settings.cta')
```

We can avoid this using the `useScopedI18n` hook / `getScopedI18n` method. And of course, the scoped key, subsequent keys and params will still be 100% type-safe.

Export `useScopedI18n` from `createI18nClient` and `getScopedI18n` from `createI18nServer`:

```ts {3,11}
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

```tsx {6,21}
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

