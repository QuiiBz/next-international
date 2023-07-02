import { assertType, describe, expect, it, vi } from 'vitest';
import { createI18n } from '../src';
import React from 'react';
import { render } from './utils';
import en from './utils/en';

const push = vi.fn();

beforeEach(() => {
  vi.mock('next/router', () => ({
    useRouter: vi.fn().mockImplementation(() => ({
      push,
      asPath: '',
      locale: 'en',
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    })),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
  push.mockReset();
});

describe('createI18n', () => {
  it('should create i18n', () => {
    const result = createI18n({});

    expect(result.I18nProvider).toBeDefined();

    expect(result.getLocaleProps).toBeDefined();
    expect(result.getLocaleProps).toBeInstanceOf(Function);

    expect(result.useChangeLocale).toBeDefined();
    expect(result.useChangeLocale).toBeInstanceOf(Function);

    expect(result.useCurrentLocale).toBeDefined();
    expect(result.useCurrentLocale).toBeInstanceOf(Function);

    expect(result.useI18n).toBeDefined();
    expect(result.useI18n).toBeInstanceOf(Function);
  });

  it('createI18n can infer types from imported .ts locales', () => {
    const { useI18n, I18nProvider, useChangeLocale, useCurrentLocale } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const changeLocale = useChangeLocale();
      const t = useI18n();

      assertType<() => 'en' | 'fr'>(useCurrentLocale);
      assertType<(newLocale: 'en' | 'fr') => void>(useChangeLocale());

      assertType<string>(useI18n()('hello'));

      //@ts-expect-error invalid key should give error
      useI18n()('asdfasdf');

      return (
        <div>
          <button type="button" onClick={() => changeLocale('fr')}>
            Change locale
          </button>
          <p>{t('hello')}</p>
        </div>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );
  });

  it('createI18n can infer types from explicitly typed locales', () => {
    type Locale = {
      hello: string;
      welcome: string;
    };

    type Locales = {
      en: Locale;
      fr: Locale;
    };

    const { useChangeLocale, useCurrentLocale, useI18n, I18nProvider } = createI18n<any, Locales>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const changeLocale = useChangeLocale();
      const t = useI18n();

      assertType<'en' | 'fr'>(useCurrentLocale());
      assertType<(newLocale: 'en' | 'fr') => void>(useChangeLocale());

      assertType<string>(useI18n()('welcome'));

      //@ts-expect-error invalid key should give error
      useI18n()('asdfasdf');

      return (
        <div>
          <button type="button" onClick={() => changeLocale('fr')}>
            Change locale
          </button>
          <p>{t('hello')}</p>
        </div>
      );
    }

    render(
      <I18nProvider locale={{ hello: 'hello', welcome: 'welcome' }}>
        <App />
      </I18nProvider>,
    );
  });
});
