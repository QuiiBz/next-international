import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from '../src';
import en from './utils/en';

beforeEach(() => {
  vi.mock('next/router', () => ({
    useRouter: vi.fn().mockImplementation(() => ({
      locale: 'en',
    })),
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('getLocaleStaticProps', () => {
  it('should return default locale', async () => {
    const { getLocaleStaticProps } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const props = await getLocaleStaticProps()({
      locale: 'en',
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    });

    expect(props).toEqual({
      props: {
        locale: en,
      },
    });
  });

  it('should return default locale with existing getStaticProps', async () => {
    const { getLocaleStaticProps } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const props = await getLocaleStaticProps(() => ({
      props: {
        hello: 'world',
      },
    }))({
      locale: 'en',
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    });

    expect(props).toEqual({
      props: {
        hello: 'world',
        locale: en,
      },
    });
  });
});
