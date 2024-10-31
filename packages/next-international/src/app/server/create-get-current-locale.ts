import { getLocaleCache } from './get-locale-cache';

export function createGetCurrentLocale<LocalesKeys>(): () => Promise<LocalesKeys> {
  return function getCurrentLocale() {
    return getLocaleCache() as Promise<LocalesKeys>;
  };
}
