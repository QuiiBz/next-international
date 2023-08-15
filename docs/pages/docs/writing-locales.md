Locales files can be written in TypeScript or JSON, but TypeScript will provide proper type-safety for params.

You can also write locales using nested objects instead of the default dot notation. You can use the syntax you prefer without updating anything else:

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
