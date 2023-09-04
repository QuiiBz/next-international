# Plurals

Plural translations work out of the box without any external dependencies, using the [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) API, which is supported in all browsers and Node.js.

To declare plural translations, append `#` followed by `zero`, `one`, `two`, `few`, `many` or `other`:

```ts {3-4}
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

This works in both Client and Server Components, and with [scoped translations](/docs/app-scoped-translations):

```tsx {7,9}
export default function Page() {
  const t = useI18n() // or `getI18n()` in Server Components

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

