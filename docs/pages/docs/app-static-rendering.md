# Static Rendering

Next.js App Router supports [Static Rendering](https://nextjs.org/docs/app/building-your-application/rendering/server-components#static-rendering-default), meaning your pages will be rendered at build time and can then be served statically from CDNs, resulting in faster TTFB.

## Static Rendering

Export `getStaticParams` from `createI18nServer`:

```ts {3}
// locales/server.ts
export const {
  getStaticParams,
  ...
} = createI18nServer({
  ...
})
```

Inside all pages that you want to be statically rendered, call this `setStaticParamsLocale` function by giving it the `locale` page param:

```tsx {2,4-5}
// app/[locale]/page.tsx and any other page
import { setStaticParamsLocale } from 'next-international/server'

// If you are using Next.js < 15, you don't need to await `params`:
// export default function Page({ params: { locale } }: { params: { locale: string } }) {
export default function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setStaticParamsLocale(locale)

  return (
    ...
  )
}
```

And export a new `generateStaticParams` function. If all your pages should be rendered statically, you can also move this to the root layout:

```ts {2,4-6}
// app/[locale]/page.tsx and any other page, or in the root layout
import { getStaticParams } from '../../locales/server'
 
export function generateStaticParams() {
  return getStaticParams()
}
```


## Static Export with `output: 'export'`

You can also export your Next.js application to be completely static using [`output: 'export'`](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) inside your `next.config.js`. Note that this will [disable many features](https://nextjs.org/docs/app/building-your-application/deploying/static-exports#unsupported-features) of Next.js
