import type { ImportedLocales } from 'international-types';
import type { GetStaticProps, GetServerSideProps } from 'next';
import { error } from '../helpers/log';
import { flattenLocale } from '../common/flatten-locale';

export function createGetLocaleProps(locales: ImportedLocales) {
  return function getLocaleProps<
    T extends { [key: string]: any },
    GetProps extends GetStaticProps<T> | GetServerSideProps<T>,
  >(initialGetProps?: GetProps) {
    return async (context: any) => {
      const initialResult = await initialGetProps?.(context);

      // No current locales means that `defaultLocale` does not exists
      if (!context.locale) {
        error(`'i18n.defaultLocale' not defined in 'next.config.js'`);
        return initialResult || { props: {} };
      }

      const load = locales[context.locale];

      return {
        ...initialResult,
        props: {
          // @ts-expect-error Next `GetStaticPropsResult` doesn't have `props`
          ...initialResult?.props,
          locale: flattenLocale((await load()).default),
        },
      };
    };
  };
}
