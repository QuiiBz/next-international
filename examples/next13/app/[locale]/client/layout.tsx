'use client';

import { ReactNode } from 'react';
import { I18nProvider } from '@/locales/client';

export default function Layout({ children, params: { locale } }: { children: ReactNode; params: { locale: string } }) {
  return (
    <I18nProvider locale={locale} fallback={<p>Loading...</p>}>
      {children}
    </I18nProvider>
  );
}
