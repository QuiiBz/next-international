import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { I18nConfig } from '../../types';

const DEFAULT_SEGMENT = 'locale';

export function createUseCurrentLocale<LocalesKeys>(locales: LocalesKeys[]): () => LocalesKeys {
  return function useCurrentLocale(config?: I18nConfig) {
    const params = useParams();
    const segment = params[config?.segment ?? DEFAULT_SEGMENT];

    return useMemo(() => {
      for (const locale of locales) {
        if (segment === locale) {
          return locale;
        }
      }

      throw new Error('Locale not found');
    }, [segment]);
  };
}
