# Writing locales

Locales files can be written in TypeScript or JSON, but writing them in TypeScript will provide proper type-safety for params.

## Dot notation

The default notation for writing locales looks like:

```ts
// locales/en.ts
export default {
  'hello.world': 'Hello {param}!',
  'hello.nested.translations': 'Translations'
} as const
```

## Object notation

You can also write locales using nested objects instead of the default dot notation.

```ts
// locales/en.ts
export default {
  hello: {
    world: 'Hello {param}!',
    nested: {
      translations: 'Translations'
    }
  }
} as const
```

## JSON

We're working on a tool to convert JSON translations to TypeScript. In the meantime, you will need to declare manually any parameter:

```ts
const locales = {
  en: () => import('./en.json')
}

type Locale = {
  'hello.world': '{param}',
  'hello.nested.translations': string
};

export const { ... } = createI18nServer<
  typeof locales,
  { en: Locale }
>(locales);
```

