import { createI18n } from 'next-international/app';
// import en from './en';

export const { getI18n, getScopedI18n, generateI18nStaticParams, getLocale, useChangeLocale } = createI18n(
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
