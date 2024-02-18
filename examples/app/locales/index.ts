import { createI18n } from 'next-international/app';

export const { useI18n, useScopedI18n, I18nProvider, generateI18nStaticParams } = createI18n({
  en: () => import('./en'),
  fr: () => import('./fr'),
});
