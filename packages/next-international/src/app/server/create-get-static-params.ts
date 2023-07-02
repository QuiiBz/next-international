import type { ImportedLocales } from 'international-types';

export function createGetStaticParams<Locales extends ImportedLocales>(locales: Locales) {
  return async function getStaticParams() {
    return Object.keys(locales).map(locale => ({
      locale,
    }));
  };
}
