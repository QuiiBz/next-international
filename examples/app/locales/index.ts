import { createI18n } from 'next-international/app';

export const { useI18n, useScopedI18n } = createI18n({
  en: () => import('./en'),
  fr: () => import('./fr'),
});
