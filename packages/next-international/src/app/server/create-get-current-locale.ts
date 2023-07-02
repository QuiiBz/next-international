import { getCurrentLocale as getCurrentLocaleFromCache } from './create-i18n-provider-server';

export function createGetCurrentLocale<LocalesKeys>(): () => LocalesKeys {
  return function getCurrentLocale() {
    return getCurrentLocaleFromCache() as LocalesKeys;
  };
}
