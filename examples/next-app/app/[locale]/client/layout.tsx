'use client';

import { ReactNode } from 'react';
import { I18nProviderClient } from '../../../locales/client';
import en from '../../../locales/en';

export default function Layout({ children, params: { locale } }: { children: ReactNode; params: { locale: string } }) {
  return (
    <I18nProviderClient locale={locale} fallback={<p> Loading...</p>} fallbackLocale={en}>
      {children}
    </I18nProviderClient>
  );
}
