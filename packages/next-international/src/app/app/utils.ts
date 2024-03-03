import type { Keys, LocaleType, Params, Scopes } from 'international-types';
import type { ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';

function flattenLocale<Locale extends LocaleType>(locale: Record<string, unknown>, prefix = ''): Locale {
  return Object.entries(locale).reduce(
    (prev, [name, value]) => ({
      ...prev,
      ...(typeof value === 'string'
        ? { [prefix + name]: value }
        : flattenLocale(value as unknown as Locale, `${prefix}${name}.`)),
    }),
    {} as Locale,
  );
}

type Cache = {
  content: LocaleType;
  pluralKeys: Set<string>;
};

const LOCALE_CACHE = new Map<string, Cache>();

export function createT<
  Locale extends LocaleType,
  Scope extends Scopes<Locale> | undefined,
  Key extends Keys<Locale, Scope>,
  Param extends Params<Locale, Scope, Key>,
>(locale: string, data: Locale, scope: Scope, key: Key, ...params: Param) {
  let cache = LOCALE_CACHE.get(locale);

  if (!cache) {
    const content = flattenLocale(data);
    const pluralKeys = new Set(
      Object.keys(content)
        .filter(key => key.includes('#'))
        .map(key => key.split('#', 1)[0]),
    );

    const newCache = {
      content,
      pluralKeys,
    };

    cache = newCache;
    LOCALE_CACHE.set(locale, newCache);
  }

  const { content, pluralKeys } = cache;
  const pluralRules = new Intl.PluralRules(locale);

  function getPluralKey(count: number) {
    if (count === 0) return 'zero';
    return pluralRules.select(count);
  }

  const paramObject = params[0];
  let isPlural = false;

  if (paramObject && 'count' in paramObject) {
    const isPluralKey = scope ? pluralKeys.has(`${scope}.${key}`) : pluralKeys.has(key);

    if (isPluralKey) {
      // @ts-expect-error - no types
      key = `${key}#${getPluralKey(paramObject.count)}` as Key;
      isPlural = true;
    }
  }

  let value = scope ? content[`${scope}.${key}`] : content[key];

  if (!value && isPlural) {
    const baseKey = key.split('#', 1)[0] as Key;
    value = (content[`${baseKey}#other`] || key)?.toString();
  } else {
    value = (value || key)?.toString();
  }

  if (!paramObject) {
    return value;
  }

  let isString = true;

  const result = value?.split(/({[^}]*})/).map((part, index) => {
    const match = part.match(/{(.*)}/);

    if (match) {
      const param = match[1] as keyof Locale;
      // @ts-expect-error - no types
      const paramValue = paramObject[param];

      if (isValidElement(paramValue)) {
        isString = false;
        return cloneElement(paramValue, { key: `${String(param)}-${index}` });
      }

      return paramValue as ReactNode;
    }

    // if there's no match - it's not a variable and just a normal string
    return part;
  });

  return isString ? result?.join('') : result;
}
