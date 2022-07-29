import { describe, expect, it, vi } from 'vitest';
import { createI18n } from '../src';
import en from './utils/en';

describe('getLocaleStaticProps', () => {
  it('should error if locale is not defined', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => null);
    const { getLocaleStaticProps } = createI18n<typeof import('./utils/en').default>({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const props = await getLocaleStaticProps()({
      locales: ['en', 'fr'],
    });

    expect(props).toEqual({
      props: {},
    });
    expect(console.error).toHaveBeenCalledWith(
      "[next-international] 'i18n.defaultLocale' not defined in 'next.config.js'",
    );
    spy.mockReset();
  });

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
