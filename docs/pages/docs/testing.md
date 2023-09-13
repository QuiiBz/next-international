# Testing

In case you want to make tests with next-international, you will need to create a custom render. The following example uses `@testing-library` and `Vitest`, but should work with `Jest` too.

```tsx
// customRender.tsx
import { ReactElement } from 'react'
import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  })

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }
```

You will also need your locales files, or one for testing purposes.

```ts
// en.ts
export default {
  hello: 'Hello',
} as const
```

Then, you can later use it in your tests:

```tsx
// *.test.tsx
import { describe, vi } from 'vitest'
import { createI18n } from 'next-international'
import { render, screen, waitFor } from './customRender' // Our custom render function.
import en from './en' // Your locales.

// Don't forget to mock the "next/router", not doing this may lead to some console errors.
beforeEach(() => {
  vi.mock('next/router', () => ({
    useRouter: vi.fn().mockImplementation(() => ({
      locale: 'en',
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    })),
  }))
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('Example test', () => {
  it('just an example', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./en'),
    })

    function App() {
      const t = useI18n()

      return <p>{t('hello')}</p>
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>
    )

    expect(screen.queryByText('Hello')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument()
    })
  })
})
```

