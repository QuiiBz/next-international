import { Locales } from '../types';
import type { GetStaticProps } from 'next';

export function createGetLocaleStaticProps(locales: Locales) {
  return function getLocaleStaticProps<T>(initialGetStaticProps?: GetStaticProps<T>) {
    const getStaticProps: GetStaticProps<T> = async context => {
      const initialResult = await initialGetStaticProps?.(context);
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
