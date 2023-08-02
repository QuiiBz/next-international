import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import type { I18nCurrentLocaleConfig } from '../../types';

const DEFAULT_SEGMENT_NAME = 'locale';

export function createUseCurrentLocale<LocalesKeys>(locales: LocalesKeys[]): () => LocalesKeys {
  return function useCurrentLocale(config?: I18nCurrentLocaleConfig) {
    const params = useParams();
    const segment = params[config?.segmentName ?? DEFAULT_SEGMENT_NAME];

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
