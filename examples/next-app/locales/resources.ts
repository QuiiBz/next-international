export const resources = {
  en: () => import('./en'),
  fr: () => import('./fr'),
};
export const defaultLocale = 'fr' as const;
export const locales = ['en', 'fr'] as const;
export type Locale = typeof locales[0];

export default resources;
