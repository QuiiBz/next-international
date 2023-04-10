import { createI18nClient } from 'next-international/client';

export const { useI18n, useScopedI18n, I18nProvider, useChangeLocale, defineLocale, getLocaleProps, useCurrentLocale } =
  createI18nClient({
    en: () => import('./en'),
    fr: () => import('./fr'),
  });
