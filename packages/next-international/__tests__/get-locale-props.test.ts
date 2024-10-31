import { describe, expect, it, vi } from 'vitest';
import { createI18n } from '../src';
import en from './utils/en';

describe('getLocaleProps', () => {
  it('should error if locale is not defined', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => null);
    const { getLocaleProps } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const props = await getLocaleProps()({
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
    const { getLocaleProps } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const props = await getLocaleProps()({
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
    const { getLocaleProps } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const props = await getLocaleProps(undefined, () => ({
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

it('should return scoped locale with when scope defined in params getStaticProps', async () => {
  const { getLocaleProps } = createI18n({
    en: () => import('./utils/en'),
    fr: () => import('./utils/fr'),
  });

  const props = await getLocaleProps(['namespace'])({
    locale: 'en',
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  });

  expect(props).toEqual({
    props: {
      locale: {
        'namespace.hello': 'Hello',
        'namespace.subnamespace.hello': 'Hello',
        'namespace.subnamespace.hello.world': 'Hello World!',
        'namespace.subnamespace.weather': "Today's weather is {weather}",
        'namespace.subnamespace.user.description': '{name} is {years} years old',
      },
    },
  });

  it('should return scoped locale with when scope defined in params getStaticProps', async () => {
    const { getLocaleProps } = createI18n({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const props = await getLocaleProps(['namespace.subnamespace'])({
      locale: 'en',
      defaultLocale: 'en',
      locales: ['en', 'fr'],
    });

    expect(props).toEqual({
      props: {
        locale: {
          'namespace.subnamespace.hello': 'Hello',
          'namespace.subnamespace.hello.world': 'Hello World!',
          'namespace.subnamespace.weather': "Today's weather is {weather}",
          'namespace.subnamespace.user.description': '{name} is {years} years old',
          locale: en,
        },
      },
    });
  });
});
