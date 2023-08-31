import type { ImportedLocales } from 'international-types';
import { I18nServerConfig } from '../../types';
import { DEFAULT_SEGMENT_NAME } from '../../common/constants';

export function createGetStaticParams<Locales extends ImportedLocales>(
  locales: Locales,
  config: I18nServerConfig<keyof Locales>,
) {
  return function getStaticParams() {
    return Object.keys(locales).map(locale => ({
      [config.segmentName ?? DEFAULT_SEGMENT_NAME]: locale,
    }));
  };
}
