'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/locales';

export default function Layout({ children, params: { locale } }: { children: ReactNode; params: { locale: string } }) {
  return <I18nProvider locale={locale}>{children}</I18nProvider>;
}
