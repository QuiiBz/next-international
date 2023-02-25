import React from 'react';
import { describe, vi } from 'vitest';
import { createI18n } from '../src';
import { render, screen, waitFor } from './utils';
import en from './utils/en';

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

describe('I18nProvider', () => {
  describe('fallback', () => {
    it('should return the fallback while loading the locale', async () => {
      const { useI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
        en: () => import('./utils/en'),
        fr: () => import('./utils/fr'),
      });

      function App() {
        const t = useI18n();

        return <p>{t('hello')}</p>;
      }

      render(
        // @ts-expect-error we don't provide `locale` to test the fallback
        <I18nProvider fallback={<p>Loading...</p>}>
          <App />
        </I18nProvider>,
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument();
      });
    });

    it('should return null if no fallback provided', async () => {
      const { useI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
        en: () => import('./utils/en'),
        fr: () => import('./utils/fr'),
      });

      function App() {
        const t = useI18n();

        return <p>{t('hello')}</p>;
      }

      render(
        // @ts-expect-error we don't provide `locale` to test the fallback
        <I18nProvider>
          <App />
        </I18nProvider>,
      );

      expect(screen.queryByText('Hello')).not.toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument();
      });
    });
  });

  describe('config', () => {
    it('should warn about mismatching locales in createI18n', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => null);

      const { useI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
        en: () => import('./utils/en'),
        fr: () => import('./utils/fr'),
        es: () => import('./utils/en'),
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

      expect(console.warn).toHaveBeenCalledWith(
        "[next-international] The following locales are defined in 'createI18n' but not in 'next.config.js': es",
      );
      spy.mockClear();
    });

    it('should warn about mismatching locales in next.config.js', () => {
      const spy = vi.spyOn(console, 'warn').mockImplementation(() => null);

      const { useI18n, I18nProvider } = createI18n<typeof import('./utils/en').default>({
        en: () => import('./utils/en'),
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

      expect(console.warn).toHaveBeenCalledWith(
        "[next-international] The following locales are defined in 'next.config.js' but not in 'createI18n': fr",
      );
      spy.mockClear();
    });
  });
});
