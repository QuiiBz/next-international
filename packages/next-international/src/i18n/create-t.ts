import { isValidElement, cloneElement, ReactNode } from 'react';
import type {
  BaseLocale,
  IsPluralKey,
  LocaleKeys,
  LocaleValue,
  Params,
  ParamsObject,
  ScopedValue,
  Scopes,
} from 'international-types';
import type { ReactParamsObject, LocaleContext, LocaleMap } from '../types';

type addCount<T> = T extends [] ? [{ count: number }] : T extends [infer R] ? [{ count: number } & R] : never;

export function createT<Locale extends BaseLocale, Scope extends Scopes<Locale> | undefined>(
  context: LocaleContext<Locale>,
  scope: Scope | undefined,
) {
  const { localeContent } = context;
  const pluralKeys = new Set(
    Object.keys(localeContent)
      .filter(key => key.endsWith('_other'))
      .map(key => key.replace('_other', '')),
  );

  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: IsPluralKey<Key, Locale> extends true
      ? addCount<Params<Value>['length'] extends 0 ? [] : [ParamsObject<Value>]>
      : Params<Value>['length'] extends 0
      ? []
      : [ParamsObject<Value>]
  ): string;
  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: IsPluralKey<Key, Locale> extends true
      ? addCount<Params<Value>['length'] extends 0 ? [] : [ReactParamsObject<Value>]>
      : Params<Value>['length'] extends 0
      ? []
      : [ReactParamsObject<Value>]
  ): React.ReactNode;
  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: IsPluralKey<Key, Locale> extends true
      ? addCount<Params<Value>['length'] extends 0 ? [] : [ParamsObject<Value> | ReactParamsObject<Value>]>
      : Params<Value>['length'] extends 0
      ? []
      : [ParamsObject<Value> | ReactParamsObject<Value>]
  ) {
    const { localeContent, fallbackLocale } = context;

    let value: string | undefined;
    const paramObject = params[0];

    if (pluralKeys.has(key) && paramObject && 'count' in paramObject) {
      const count = paramObject.count ?? 0;
      const pr = new Intl.PluralRules(); // FIXME: pass current locale
      const suffix = count === 0 ? 'zero' : pr.select(count);
      console.log(count, suffix);

      const pluralKey = `${key}_${suffix}`;

      value = (
        ((scope ? localeContent[`${scope}.${pluralKey}`] : localeContent[pluralKey]) ||
          (scope ? fallbackLocale?.[`${scope}.${pluralKey}`] : fallbackLocale?.[pluralKey]) ||
          (scope ? localeContent[`${scope}.${key}`] : localeContent[key]) ||
          (scope ? fallbackLocale?.[`${scope}.${key}`] : fallbackLocale?.[key]) ||
          key) as string
      ).toString();
    } else {
      value = (
        ((scope ? localeContent[`${scope}.${key}`] : localeContent[key]) ||
          (scope ? fallbackLocale?.[`${scope}.${key}`] : fallbackLocale?.[key]) ||
          key) as string
      ).toString();
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

        if (typeof paramValue !== 'string') isString = false;

        return isValidElement(paramValue)
          ? cloneElement(paramValue, { key: `${String(param)}-${index}` })
          : (paramValue as ReactNode);
      }

      // if there's no match - it's not a variable and just a normal string
      return part;
    });

    return isString ? result?.join('') : result;
  }

  return t;
}
