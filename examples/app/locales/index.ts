import { createI18n } from 'next-international/app';
// import en from './en';

export const { useI18n, useScopedI18n, generateI18nStaticParams, useLocale, useChangeLocale } = createI18n(
  {
    en: () => import('./en'),
    fr: () => import('./fr'),
  },
  {
    // segmentName: 'locale',
    // basePath: '/base',
    // fallbackLocale: en,
  },
);
