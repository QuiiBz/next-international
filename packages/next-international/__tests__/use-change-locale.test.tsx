import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from '../src';
import { render, userEvent, screen } from './utils';
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

describe('useChangeLocale', () => {
  it('should change locale', async () => {
    const { useI18n, I18nProvider, useChangeLocale } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    function App() {
      const changeLocale = useChangeLocale();
      const t = useI18n();

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

    await userEvent.click(screen.getByText('Change locale'));
    expect(push).toHaveBeenCalledOnce();
  });
});
