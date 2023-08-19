import type { ImportedLocales } from 'international-types';
import { I18nStaticParamsConfig } from '../../types';
import { DEFAULT_SEGMENT_NAME } from '../../common/constants';

export function createGetStaticParams<Locales extends ImportedLocales>(locales: Locales) {
  return function getStaticParams(config?: I18nStaticParamsConfig) {
    return Object.keys(locales).map(locale => ({
      [config?.segmentName ?? DEFAULT_SEGMENT_NAME]: locale,
    }));
  };
}
