'use client';

import type { LocaleType } from 'international-types';
import type { I18nProvider } from './types';

export const createI18nProvider = <Locale extends LocaleType>() => {
  const Provider: I18nProvider<Locale> = ({ children }) => {
    return children;
  };

  return Provider;
};
