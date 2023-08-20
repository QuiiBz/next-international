# Scoped translations

When you have a lot of keys, you may notice in a file that you always use and duplicate the same scope:

```ts
// We always repeat `pages.settings`
t('pages.settings.title')
t('pages.settings.description', { identifier })
t('pages.settings.cta')
```

We can avoid this using the `useScopedI18n` hook / `getScopedI18n` method. And of course, the scoped key, subsequent keys and params will still be 100% type-safe.

Export `useScopedI18n` from `createI18n`:

```ts {3}
// locales/index.ts
export const {
  useScopedI18n,
  ...
} = createI18n({
  ...
})
```

Then use it in your component:

```tsx {4}
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

