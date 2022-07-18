import { Locales } from '../types';
import type { GetStaticProps } from 'next';
import { error } from '../helpers/log';

export function createGetLocaleStaticProps(locales: Locales) {
  return function getLocaleStaticProps<T>(initialGetStaticProps?: GetStaticProps<T>) {
    const getStaticProps: GetStaticProps<T> = async context => {
      const initialResult = await initialGetStaticProps?.(context);

      // No current locales means that `defaultLocale` does not exists
      if (!context.locale) {
        error(`'i18n.defaultLocale' not defined in 'next.config.js'`);
        return initialResult || { props: {} };
      }

      const load = locales[context.locale!];

      return {
        ...initialResult,
        props: {
          // @ts-expect-error Next `GetStaticPropsResult` doesn't have `props`
          ...initialResult?.props,
          locale: (await load()).default,
        },
      };
    };

    return getStaticProps;
  };
}
