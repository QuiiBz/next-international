import { createI18n } from 'next-international';
import type Locale from './en';

export const { useI18n, I18nProvider, useChangeLocale, defineLocale, getLocaleProps } = createI18n<typeof Locale>({
  en: () => import('./en'),
  fr: () => import('./fr'),
});
