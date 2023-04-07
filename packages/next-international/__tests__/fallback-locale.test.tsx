import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from '../src';
import { render, screen } from './utils';
import en from './utils/en';
import fr from './utils/fr';

beforeEach(() => {
  vi.mock('next/router', () => ({
    useRouter: vi.fn().mockImplementation(() => ({
      locale: 'fr',
      defaultLocale: 'fr',
      locales: ['en', 'fr'],
    })),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('fallbackLocale', () => {
  it('should output the key when no fallback locale is configured', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

      return <p>{t('only.exists.in.en')}</p>;
    }

    render(
      // @ts-expect-error missing key
      <I18nProvider locale={fr}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('only.exists.in.en')).toBeInTheDocument();
  });

  it('should output the key when no fallback locale is configured', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const t = useI18n();

      return <p>{t('only.exists.in.en')}</p>;
    }

    render(
      // @ts-expect-error missing key
      <I18nProvider locale={fr} fallbackLocale={en}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('EN locale')).toBeInTheDocument();
  });
});
