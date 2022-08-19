import React, { useContext, Context } from 'react';
import type {
  BaseLocale,
  LocaleKeys,
  LocaleValue,
  Params,
  ParamsObject,
  ScopedValue,
  Scopes,
} from 'international-types';
import type { LocaleContext } from '../types';

export function createUsei18n<Locale extends BaseLocale>(I18nContext: Context<LocaleContext<Locale> | null>) {
  return function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    function createT<Scope extends Scopes<Locale> | undefined>(scope: Scope) {
      return function t<
        Key extends LocaleKeys<Locale, Scope>,
        Value extends LocaleValue = ScopedValue<Locale, Scope, Key>,
      >(key: Key, ...params: Params<Value>['length'] extends 0 ? [] : [ParamsObject<Value>]) {
        const { localeContent, fallbackLocale } = context as LocaleContext<Locale>;

        let value = (
          (scope ? localeContent[`${scope}.${key}`] : localeContent[key]) ||
          (scope ? fallbackLocale?.[`${scope}.${key}`] : fallbackLocale?.[key]) ||
          key
        ).toString();
        const paramObject = params[0];

        if (!paramObject) {
          return value;
        }

        for (const [param, paramValue] of Object.entries(paramObject as Locale)) {
          value = value.toString().replaceAll(`{${param}}`, paramValue.toString());
        }

        return value;
      };
    }

    function scopedT<Scope extends Scopes<Locale>>(scope: Scope) {
      return createT(scope);
    }

    return {
      t: createT(undefined),
      scopedT,
    };
  };
}
