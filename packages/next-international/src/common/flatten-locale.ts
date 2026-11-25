import type { BaseLocale } from 'international-types';

const collectEntries = (locale: Record<string, unknown>, prefix: string, entries: [string, string][]) => {
  for (const [name, value] of Object.entries(locale)) {
    if (typeof value === 'string') {
      entries.push([prefix + name, value]);
    } else {
      collectEntries(value as Record<string, unknown>, `${prefix}${name}.`, entries);
    }
  }

  return entries;
};

export const flattenLocale = <Locale extends BaseLocale>(locale: Record<string, unknown>, prefix = ''): Locale =>
  Object.fromEntries(collectEntries(locale, prefix, [])) as Locale;
