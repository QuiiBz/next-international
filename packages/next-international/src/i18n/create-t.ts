import { isValidElement, cloneElement, ReactNode } from 'react';
import type {
  BaseLocale,
  LocaleKeys,
  LocaleValue,
  Params,
  ParamsObject,
  ScopedValue,
  Scopes,
} from 'international-types';
import type { ReactParamsObject, LocaleContext, LocaleMap } from '../types';

export function createT<Locale extends BaseLocale, Scope extends Scopes<Locale> | undefined>(
  context: LocaleContext<Locale> | null,
  scope: Scope | undefined,
) {
  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: Params<Value>['length'] extends 0 ? [] : [ParamsObject<Value>]
  ): string;
  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: Params<Value>['length'] extends 0 ? [] : [ReactParamsObject<Value>]
  ): React.ReactNode;
  function t<Key extends LocaleKeys<Locale, Scope>, Value extends LocaleValue = ScopedValue<Locale, Scope, Key>>(
    key: Key,
    ...params: Params<Value>['length'] extends 0 ? [] : [ParamsObject<Value> | ReactParamsObject<Value>]
  ) {
    const { localeContent, fallbackLocale } = context as LocaleContext<Locale>;

    const value = (
      (scope ? localeContent[`${scope}.${key}`] : localeContent[key]) ||
      (scope ? fallbackLocale?.[`${scope}.${key}`] : fallbackLocale?.[key]) ||
      key
    )?.toString();
    const paramObject = params[0];

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
