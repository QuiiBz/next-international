# Static Site Generation

Next.js allows to render pages statically with `output: 'export'` inside `next.config.js`. Export `getLocaleProps` from `createI18n`:

```ts
// locales/index.ts
export const {
  getLocaleProps,
  ...
} = createI18n({
  ...
})
```

Then, export a `getStaticProps` variable from your pages, or wrap your existing `getStaticProps`:

```ts
// pages/index.tsx
export const getStaticProps = getLocaleProps()

// or with an existing `getStaticProps` function:
export const getStaticProps = getLocaleProps(ctx => {
  // your existing code
  return {
    ...
  }
})
```

## Static Site Rendering

If you already have a `getServerSideProps` on a page, you can't use `getStaticProps`. In this case, you can still use `getLocaleProps` the same way:

```ts
// pages/index.tsx
export const getServerSideProps = getLocaleProps(ctx => {
  // your existing code
  return {
    ...
  }
})
```
