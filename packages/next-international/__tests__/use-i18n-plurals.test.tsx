import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from '../src';
import { render, screen } from './utils';
import pl from './utils/pl-plural';

beforeEach(() => {
  vi.mock('next/router', () => ({
    useRouter: vi.fn().mockImplementation(() => ({
      locale: 'pl',
      defaultLocale: 'pl',
      locales: ['pl', 'en'],
    })),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('useI18n with plural translations', () => {
  it('should translate with plural keys in different locale', async () => {
    const { useI18n, I18nProvider } = createI18n({
      en: () => import('./utils/en-plural'),
      fr: () => import('./utils/pl-plural'),
    });

    function App() {
      const t = useI18n();

      return (
        <div>
          <p>
            {t('cow', {
              count: 0,
            })}
          </p>
          <p>
            {t('cow', {
              count: 1,
            })}
          </p>
          <p>
            {t('cow', {
              count: 4,
            })}
          </p>
          <p>
            {t('cow', {
              count: 5,
            })}
          </p>
        </div>
      );
    }

    render(
      <I18nProvider locale={pl}>
        <App />
      </I18nProvider>,
    );

    expect(screen.getByText('Zero krów')).toBeInTheDocument();
    expect(screen.getByText('Jedna krowa')).toBeInTheDocument();
    expect(screen.getByText('4 krowy')).toBeInTheDocument();
    expect(screen.getByText('5 krów')).toBeInTheDocument();
  });
});
