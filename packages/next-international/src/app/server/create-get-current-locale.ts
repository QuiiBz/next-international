import { getCurrentLocale as getCurrentLocaleFromCache } from './create-i18n-provider-server';

export function createGetCurrentLocale() {
  return function getCurrentLocale() {
    return getCurrentLocaleFromCache();
  };
}
