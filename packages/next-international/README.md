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
- [Examples](#examples)
  - [Scoped translations](#scoped-translations)
  - [Change and get current locale](#change-and-get-current-locale)
  - [Plurals](#plurals)
  - [Fallback locale for missing translations](#fallback-locale-for-missing-translations)
  - [Use JSON files instead of TS for locales](#use-json-files-instead-of-ts-for-locales)
  - [Explicitly typing the locales](#explicitly-typing-the-locales)
  - [Load initial locales client-side](#load-initial-locales-client-side)
  - [Type-safety on locales files](#type-safety-on-locales-files)
  - [Use the types for my own library](#use-the-types-for-my-own-library)
  - [Testing](#testing)
- [License](#license)

## Features

- **100% Type-safe**: Locales in TS or JSON, type-safe `t()` & `scopedT()`, type-safe params and plurals
- **Small**: 1.2 KB gzipped (1.7 KB uncompressed), no dependencies
- **Simple**: No webpack configuration, no CLI, just pure TypeScript
- **SSR**: Load only the required locale, SSRed

> **Note**: You can now build on top of the types used by next-international using [international-types](https://github.com/QuiiBz/next-international/tree/main/packages/international-types)!

## Usage

```bash
pnpm install next-international
```

1. Make sure that you've followed [Next.js Internationalized Routing](https://nextjs.org/docs/advanced-features/i18n-routing), and that `strict` is set to `true` in your `tsconfig.json`

2. Create `locales/index.ts` with your locales:

```ts
import { createI18n } from 'next-international'

export const { useI18n, I18nProvider, getLocaleProps } = createI18n({
  en: () => import('./en'),
  fr: () => import('./fr'),

})
```

Each locale file should export a default object (don't forget `as const`):

```ts
// locales/en.ts
export default {
  hello: 'Hello',
  welcome: 'Hello {name}!',
} as const;
```

3. Wrap your whole app with `I18nProvider` inside `_app.tsx`:

```tsx
// pages/_app.tsx
import { I18nProvider } from '../locales'

function App({ Component, pageProps }) {
  return (
    <I18nProvider locale={pageProps.locale}>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
```

4. Add `getLocaleProps` to your pages, or wrap your existing `getStaticProps` (this will allows SSR locales, see [Load initial locales client-side](#load-initial-locales-client-side) if you want to load the initial locale client-side):

```ts
export const getStaticProps = getLocaleProps()

// or with an existing `getStaticProps` function:
export const getStaticProps = getLocaleProps((ctx) => {
  // your existing code
  return {
    ...
  }
})
```

If you already have `getServerSideProps` on this page, you can't use `getStaticProps`. In this case, you can still use `getLocaleProps` the same way:

```ts
export const getServerSideProps = getLocaleProps()

// or with an existing `getServerSideProps` function:
export const getServerSideProps = getLocaleProps((ctx) => {
  // your existing code
  return {
    ...
  }
})
```

5. Use `useI18n`:

```tsx
import { useI18n } from '../locales';

function App() {
  const t = useI18n();
  return (
    <div>
      <p>{t('hello')}</p>
      <p>{t('welcome', { name: 'John' })}</p>
      <p>{t('welcome', { name: <strong>John</strong> })}</p>
    </div>
  );
}
```

## Examples

### Scoped translations

When you have a lot of keys, you may notice in a file that you always use and such duplicate the same scope:

```ts
// We always repeat `pages.settings`
t('pages.settings.title');
t('pages.settings.description', { identifier });
t('pages.settings.cta');
```

We can avoid this using the `useScopedI18n` hook. Export it from `createI18n`:

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

```ts
import { useScopedI18n } from '../locales';

function App() {
  const t = useScopedI18n('pages.settings');

  return (
    <div>
      <p>{t('title')}</p>
      <p>{t('description', { identifier })}</p>
      <p>{t('cta')}</p>
    </div>
  );
}
```

And of course, the scoped key, subsequents keys and params will still be 100% type-safe.

### Change and get current locale

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

Then use this as a hook:

```tsx
import { useChangeLocale, useCurrentLocale } from '../locales'

function App() {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()
  //    ^ typed as 'en' | 'fr'

  return (
    <>
    <p>Current locale: <span>{locale}</span></p>
    <button onClick={() => changeLocale('en')}>English</button>
    <button onClick={() => changeLocale('fr')}>French</button>
    <>
  )
}
```

### Plurals

To use plurals, add plural suffixes to your keys:

```ts
{
  "cow#zero": "No cows",
  "cow#one": "One cow",
  "cow#other": "{count} cows",
}
```

then use it like this:

```tsx

t('cow', { count: 0 }) // No cows
t('cow', { count: 1 }) // One cow
t('cow', { count: 2 }) // 2 cows
// etc.
```

For each locale you should specify all needed plural suffixes, eg. for Polish you'd have:

```tsx
  'cow#zero': 'Zero krów',
  'cow#one': 'Jedna krowa',
  'cow#few': '{count} krowy',
  'cow#many': '{count} krów',
  'cow#other': '{count} krowy',

```


> Note, in English `zero` and `other` are the same, so you can omit `zero` and `other` will be used. 
> However if you specify it, it will be used instead of `other`.

`count` param is always added to a plural key, you always have to specify it, even if you don't use it directly in the translation.

You can also use other params, as in other translations:

```ts
{
  "cow#zero": "No cows",
  "cow#one": "One cow",
  "cow#other": "{count} cows, {name} has {count} cows",
}
```

```tsx
t('cow', { count: 0, name: 'John' }) // No cows
t('cow', { count: 2, name: 'John' }) // 2 cows, John has 2 cows
```

### Fallback locale for missing translations

It's common to have missing translations in an application. By default, next-international outputs the key when no translation is found for the current locale, to avoid sending to users uncessary data.

You can provide a fallback locale that will be used for all missing translations:

```tsx
// pages/_app.tsx
import { I18nProvider } from '../locales';
import en from '../locales/en';

<I18nProvider locale={pageProps.locale} fallbackLocale={en}>
  ...
</I18nProvider>;
```

### Use JSON files instead of TS for locales

Currently, this breaks the parameters type-safety, so we recommend using the TS syntax. See this issue: https://github.com/microsoft/TypeScript/issues/32063.

You can still get type-safety by [explicitly typing the locales](#explicitly-typing-the-locales)

```ts
// locales/index.ts
import { createI18n } from 'next-international'

export const { useI18n, I18nProvider, getLocaleProps } = createI18n({
  en: () => import('./en.json'),
  fr: () => import('./fr.json'),
});
```

### Explicitly typing the locales

If you want to explicitly type the locale, you can create an interface that extends `BaseLocale` and use it as the generic in `createI18n`:

```ts
// locales/index.ts
import { createI18n } from 'next-international';

type Locale = {
  hello: string;
  welcome: string;
}

type Locales = {
  en: Locale;
  fr: Locale;
}

export const {
  ...
} = createI18n<any, Locales>({
  en: () => import('./en.json'),
  fr: () => import('./fr.json'),
})
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

### Type-safety on locales files

Using `defineLocale`, you can make sure all your locale files implements all the keys of the base locale:

```ts
// locales/index.ts
export const {
  defineLocale
  ...
} = createI18n({
  ...
})
```

It's a simple wrapper function around other locales:

```ts
// locales/fr.ts
export default defineLocale({
  hello: 'Bonjour',
  welcome: 'Bonjour {name}!',
});
```

### Use the types for my own library

We also provide a separate package called [international-types](https://github.com/QuiiBz/next-international/tree/main/packages/international-types) that contains the utility types for next-international. You can build a library on top of it and get the same awesome type-safety.

### Testing

In case you want to make tests with next-international, you will need to create a custom render. The following example uses `@testing-library` and `Vitest`, but should work with `Jest` too.

```tsx
// customRender.tsx
import { cleanup, render } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  });

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
// override render export
export { customRender as render };
```

You will also need a locale created, or one for testing purposes.

```ts
// en.ts
export default {
  hello: 'Hello',
} as const;
```

Then, you can later use it in your tests like this.

```tsx
// *.test.tsx
import { describe, vi } from 'vitest';
import { createI18n } from 'next-international';
import { render, screen, waitFor } from './customRender'; // Our custom render function.
import en from './en'; // Your locales.

// Don't forget to mock the "next/router", not doing this may lead to some console errors.
beforeEach(() => {
  vi.mock('next/router', () => ({
    useRouter: vi.fn().mockImplementation(() => ({
      locale: 'en',
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    })),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Example test', () => {
  it('just an example', async () => {
    const { useI18n, I18nProvider } = createI18n<typeof import('./en')>({
      en: () => import('./en'),
      // Other locales you might have.
    });

    function App() {
      const t = useI18n();

      return <p>{t('hello')}</p>;
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.queryByText('Hello')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
  });
});
```

## License

[MIT](./LICENSE)
