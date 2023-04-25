import React from 'react';
import { renderHook } from '@testing-library/react';
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

describe('useI18n', () => {
  it('should log error if locale not set in next.config.js', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => null);
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
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
    expect(console.error).toHaveBeenCalledWith(
      "[next-international] 'i18n.defaultLocale' not defined in 'next.config.js'",
    );

    spy.mockReset();
  });

  it('should log error if locales not set in next.config.js', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => null);
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
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
    expect(console.error).toHaveBeenCalledWith("[next-international] 'i18n.locales' not defined in 'next.config.js'");

    spy.mockReset();
  });

  it('should throw if not used inside I18nProvider', () => {
    const { useI18n } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

      return <p>{t('hello')}</p>;
    }

    expect(() => render(<App />)).toThrowError('`useI18n` must be used inside `I18nProvider`');
  });

  it('should translate', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
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

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should translate multiple keys', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

      return <p>{t('hello.world')}</p>;
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('Hello World!')).toBeInTheDocument();
  });

  it('should translate with param', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

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

  it('should translate with param (with react component)', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

      return (
        <p data-testid="test">
          {t('weather', {
            weather: <strong>sunny</strong>,
          })}
        </p>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );
    expect(screen.getByTestId('test')).toHaveTextContent("Today's weather is sunny");
  });

  it('should translate with the same param used twice', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

      return (
        <p>
          {t('double.param', {
            param: '<PARAMETER>',
          })}
        </p>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );
    expect(screen.getByText('This <PARAMETER> is used twice (<PARAMETER>)')).toBeInTheDocument();
  });

  it('should translate with multiple params', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

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

  it('return a string if no properties are passed', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const App = ({ children }: { children: React.ReactNode }) => {
      return <I18nProvider locale={en}>{children}</I18nProvider>;
    };

    const { result } = renderHook(
      () => {
        const t = useI18n();
        return t('hello');
      },
      {
        wrapper: App,
      },
    );

    expect(typeof result.current).toBe('string');
  });

  it('return a string if all properties are strings', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const App = ({ children }: { children: React.ReactNode }) => {
      return <I18nProvider locale={en}>{children}</I18nProvider>;
    };

    const { result } = renderHook(
      () => {
        const t = useI18n();
        return t('user.description', {
          name: 'John',
          years: '30',
        });
      },
      {
        wrapper: App,
      },
    );

    expect(typeof result.current).toBe('string');
  });

  it('return an array if some property is a react node', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const App = ({ children }: { children: React.ReactNode }) => {
      return <I18nProvider locale={en}>{children}</I18nProvider>;
    };

    const { result } = renderHook(
      () => {
        const t = useI18n();
        return t('user.description', {
          name: <strong>John</strong>,
          years: '30',
        });
      },
      {
        wrapper: App,
      },
    );

    expect(Array.isArray(result.current)).toBe(true);
  });

  it('should translate with plural keys', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

      return (
        <div>
          <p>
            {t('thing', {
              count: 0,
              adjective: 'cool',
            })}
          </p>
          <p>
            {t('thing', {
              count: 1,
              adjective: 'cool',
            })}
          </p>
          <p>
            {t('thing', {
              count: 5,
              adjective: 'cool',
            })}
          </p>
        </div>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('No things')).toBeInTheDocument();
    expect(screen.getByText('One thing')).toBeInTheDocument();
    expect(screen.getByText('5 cool things')).toBeInTheDocument();
  });

  it('should translate with plural keys in different locale', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

      return (
        <div>
          <p>
            {t('thing', {
              count: 0,
              adjective: 'cool',
            })}
          </p>
          <p>
            {t('thing', {
              count: 1,
              adjective: 'cool',
            })}
          </p>
          <p>
            {t('thing', {
              count: 5,
              adjective: 'cool',
            })}
          </p>
        </div>
      );
    }

    render(
      <I18nProvider locale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('No things')).toBeInTheDocument();
    expect(screen.getByText('One thing')).toBeInTheDocument();
    expect(screen.getByText('5 cool things')).toBeInTheDocument();
  });
});
