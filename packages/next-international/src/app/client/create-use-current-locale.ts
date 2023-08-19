import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { DEFAULT_SEGMENT_NAME } from '../../common/constants';
import { I18nClientConfig } from '../../types';

export function createUseCurrentLocale<LocalesKeys>(locales: LocalesKeys[], config: I18nClientConfig) {
  return function useCurrentLocale() {
    const params = useParams();
    const segment = params[config.segmentName ?? DEFAULT_SEGMENT_NAME];

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
