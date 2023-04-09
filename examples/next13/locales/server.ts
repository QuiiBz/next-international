import { createAppI18n } from 'next-international/app';

export const { getI18n, getScopedI18n } = createAppI18n({
  en: () => import('./en'),
  fr: () => import('./fr'),
});
