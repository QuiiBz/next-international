import React, { useContext, Context } from 'react';
import { Locale, LocaleContext, LocaleKeys, LocaleValue, Params, ParamsObject, ScopedValue, Scopes } from '../types';

export function createUsei18n<LocaleType extends Locale>(I18nContext: Context<LocaleContext<LocaleType> | null>) {
  return function useI18n() {
    const context = useContext(I18nContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    function createT<Scope extends Scopes<LocaleType> | undefined>(scope: Scope) {
      return function t<
        Key extends LocaleKeys<LocaleType, Scope>,
        Value extends LocaleValue = ScopedValue<LocaleType, Scope, Key>,
      >(key: Key, ...params: Params<Value>['length'] extends 0 ? [] : [ParamsObject<Value>]) {
        const { localeContent } = context as LocaleContext<LocaleType>;

        let value;

        if (scope) {
          value = (localeContent[`${scope}.${key}`] || key).toString();
        } else {
          value = (localeContent[key] || key).toString();
        }

        const paramObject = params[0];

        if (!paramObject) {
          return value;
        }

        for (const [param, paramValue] of Object.entries(paramObject as Locale)) {
          value = value.toString().replace(`{${param}}`, paramValue.toString());
        }

        return value;
      };
    }

    function scopedT<Scope extends Scopes<LocaleType>>(scope: Scope) {
      return createT(scope);
    }

    return {
      t: createT(undefined),
      scopedT,
    };
  };
}
