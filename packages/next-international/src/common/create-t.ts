import { isValidElement, cloneElement, ReactNode } from 'react';
import type {
  BaseLocale,
  CreateParams,
  LocaleKeys,
  LocaleValue,
  ParamsObject,
  ScopedValue,
  Scopes,
} from 'international-types';
import type { ReactParamsObject, LocaleContext, LocaleMap } from '../types';

export function createT<Locale extends BaseLocale, Scope extends Scopes<Locale> | undefined>(
  context: LocaleContext<Locale>,
  scope: Scope | undefined,
) {
  const { localeContent, fallbackLocale } = context;
  // If there is no localeContent (e.g. on initial render on the client-side), we use the fallback locale
  // otherwise, we use the fallback locale as a fallback for missing keys in the current locale
  const content =
    fallbackLocale && typeof localeContent === 'string'
      ? fallbackLocale
      : Object.assign(fallbackLocale ?? {}, localeContent);

  const pluralKeys = new Set(
    Object.keys(content)
      .filter(key => key.includes('#'))
      .map(key => key.split('#')[0]),
  );

  function getPluralKey(count: number) {
    if (count === 0) return 'zero';
    return pluralRules.select(count);
  }
  const pluralRules = new Intl.PluralRules(context.locale);

  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: CreateParams<ParamsObject<Value>, Locale, Scope, Key, Value>
  ): string;
  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: CreateParams<ReactParamsObject<Value>, Locale, Scope, Key, Value>
  ): React.ReactNode;
  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: CreateParams<ParamsObject<Value> | ReactParamsObject<Value>, Locale, Scope, Key, Value>
  ) {
    const paramObject = params[0];
    let isPlural = false;

    if (paramObject && 'count' in paramObject) {
      const isPluralKey = scope ? pluralKeys.has(`${scope}.${key}`) : pluralKeys.has(key);

      if (isPluralKey) {
        key = `${key}#${getPluralKey(paramObject.count)}` as Key;
        isPlural = true;
      }
    }

    let value = scope ? content[`${scope}.${key}`] : content[key];

    if (!value && isPlural) {
      const baseKey = key.split('#')[0] as Key;
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
        const paramValue = (paramObject as LocaleMap<Locale>)[param];

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

  return t;
}
