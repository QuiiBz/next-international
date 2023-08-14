---
title: Get and change the current locale
description: TODO
sidebar:
    order: 2
---

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
      <p>Current locale: {locale}</p>
      <button onClick={() => changeLocale('en')}>English</button>
      <button onClick={() => changeLocale('fr')}>French</button>
    </>
  )
}
```

