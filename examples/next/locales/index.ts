import { createI18n } from 'next-international';
import type Locale from './en';

const locales = {
  en: () => import('./en'),
  fr: () => import('./fr'),
};

export const { useI18n, useScopedI18n, I18nProvider, useChangeLocale, defineLocale, getLocaleProps, useCurrentLocale } =
  createI18n<typeof Locale, typeof locales>(locales);
