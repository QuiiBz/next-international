import type { BaseLocale, Scopes } from 'international-types';

export const filterLocalesByNameSpace = <Locale extends BaseLocale, Scope extends Scopes<Locale>>(
  locale: Locale,
  scopes?: Scope[],
): Locale => {
  if (!scopes?.length) return locale;

  return Object.entries(locale).reduce((prev, [name, value]) => {
    if (scopes.some(scope => name.startsWith(scope))) {
      const k = name as keyof Locale;
      prev[k] = value as Locale[string];
    }

    return prev;
  }, {} as Locale);
};
