import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from '../src';
import { render, screen } from './utils';
import en from './utils/en';

beforeEach(() => {
  vi.mock('next/router', () => ({
    useRouter: vi
      .fn()
      .mockImplementationOnce(() => ({
        locales: ['en', 'fr'],
      }))
      .mockImplementationOnce(() => ({
        locale: 'en',
        defaultLocale: 'en',
      }))
      .mockImplementation(() => ({
        locale: 'en',
        defaultLocale: 'en',
        locales: ['en', 'fr'],
      })),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useScopedI18n', () => {
  it('should log error if locale not set in next.config.js', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => null);
    const { useScopedI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useScopedI18n('namespace.subnamespace');

      return <p>{t('hello')}</p>;
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );
    expect(console.error).toHaveBeenCalledWith(
      "[next-international] 'i18n.defaultLocale' not defined in 'next.config.js'",
    );

    spy.mockReset();
  });

  it('should log error if locales not set in next.config.js', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => null);
    const { useScopedI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useScopedI18n('namespace.subnamespace');

      return <p>{t('hello')}</p>;
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );
    expect(console.error).toHaveBeenCalledWith("[next-international] 'i18n.locales' not defined in 'next.config.js'");

    spy.mockReset();
  });

  it('should throw if not used inside I18nProvider', () => {
    const { useScopedI18n } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useScopedI18n('namespace.subnamespace');

      return <p>{t('hello')}</p>;
    }

    expect(() => render(<App />)).toThrowError('`useI18n` must be used inside `I18nProvider`');
  });

  it('should translate', async () => {
    const { useScopedI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useScopedI18n('namespace');

      return <p>{t('hello')}</p>;
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should translate multiple keys', async () => {
    const { useScopedI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useScopedI18n('namespace.subnamespace');

      return (
        <>
          <p>{t('hello')}</p>
          <p>{t('hello.world')}</p>
        </>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hello World!')).toBeInTheDocument();
  });

  it('should translate with param', async () => {
    const { useScopedI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useScopedI18n('namespace.subnamespace');

      return (
        <p>
          {t('weather', {
            weather: 'sunny',
          })}
        </p>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText("Today's weather is sunny")).toBeInTheDocument();
  });

  it('should translate with multiple params', async () => {
    const { useScopedI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useScopedI18n('namespace.subnamespace');

      return (
        <p>
          {t('user.description', {
            name: 'John',
            years: '30',
          })}
        </p>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('John is 30 years old')).toBeInTheDocument();
  });

  it('should translate with multiple params (using react component)', async () => {
    const { useScopedI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useScopedI18n('namespace.subnamespace');

      return (
        <p data-testid="test">
          {t('user.description', {
            name: <strong>John</strong>,
            years: '30',
          })}
        </p>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByTestId('test')).toHaveTextContent('John is 30 years old');
  });
});
