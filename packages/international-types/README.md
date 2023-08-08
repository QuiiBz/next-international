<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/QuiiBz/next-international/blob/main/assets/logo-white.png">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/QuiiBz/next-international/blob/main/assets/logo-black.png" />
    <img alt="" height="100px" src="https://github.com/QuiiBz/next-international/blob/main/assets/logo-white.png">
  </picture>
  <br />
  Type-safe internationalization (i18n) utility types
</p>

---

- [Features](#features)
- [Usage](#usage)
  - [Type-safe keys](#type-safe-keys)
- [License](#license)

## Features

- **Autocompletion**: For locale keys, scopes and params!
- **Extensible**: Designed to be used with any library

> **Note**: Using Next.js? Check out [next-international](https://github.com/QuiiBz/next-international)!

## Usage

```bash
pnpm install international-types
```

### Type-safe keys

```ts
import type { LocaleKeys } from 'international-types'

type Locale = {
  hello: 'Hello'
  'hello.world': 'Hello World!'
}

function t<Key extends LocaleKeys<Locale, undefined>>(key: Key) {
  // ...
}

t('')
// hello | hello.world
```

### Type-safe scopes with keys

```ts
import type { LocaleKeys, Scopes } from 'international-types'

type Locale = {
  hello: 'Hello'
  'scope.nested.demo': 'Nested scope'
  'scope.nested.another.demo': 'Another nested scope'
}

function scopedT<Scope extends Scopes<Locale>>(scope: Scope) {
  return function t<Key extends LocaleKeys<Locale, Scope>>(key: Key) {
    // ...
  }
}

const t = scopedT('')
// scope | scope.nested

t('')
// For scope: nested.demo | nested.another.demo
// For scope.nested: demo | another.demo
```

### Type-safe params

```ts
import type { LocaleKeys, BaseLocale, Scopes, ScopedValue, CreateParams, ParamsObject } from 'international-types'

type Locale = {
  param: 'This is a {value}'
  'hello.people': 'Hello {name}! You are {age} years old.'
}

function scopedT<Locale extends BaseLocale, Scope extends Scopes<Locale> | undefined>(scope?: Scope) {
  return function t<Key extends LocaleKeys<Locale, Scope>, Value extends ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: CreateParams<ParamsObject<Value>, Locale, Scope, Key, Value>
  ) {
    // ...
  }
}

const t = scopedT<Locale, undefined>();

t('param', {
  value: ''
  // value is required
})

t('hello.people', {
  name: '',
  age: ''
  // name and age are required
})
```

## License

[MIT](./LICENSE)
