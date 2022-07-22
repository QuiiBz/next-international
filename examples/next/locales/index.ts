import { createI18n } from 'next-international';
import type Locale from './en';

declare module 'next-international' {
  interface BaseLocale {
    hello: string;
    test: '{param}';
  }
}

export const { useI18n, I18nProvider, useChangeLocale, defineLocale, getLocaleStaticProps } = createI18n({
  en: () => import('./en'),
  fr: () => import('./fr'),
});
