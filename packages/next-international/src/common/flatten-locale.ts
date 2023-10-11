import type { BaseLocale } from 'international-types';

export const flattenLocale = <Locale extends BaseLocale>(locale: Record<string, unknown>, prefix = ''): Locale =>
  Object.entries(locale).reduce(
    (prev, [name, value]) => ({
      ...prev,
      ...(typeof value === 'string'
        ? { [prefix + name]: value }
        : flattenLocale(value as unknown as Locale, `${prefix}${name}.`)),
    }),
    {} as Locale,
  );
