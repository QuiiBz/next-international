import { getLocaleCache } from './get-locale-cache';

export function createGetCurrentLocale<LocalesKeys>(): () => LocalesKeys {
  return function getCurrentLocale() {
    return getLocaleCache() as LocalesKeys;
  };
}
