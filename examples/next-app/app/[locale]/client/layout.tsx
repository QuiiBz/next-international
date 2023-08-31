'use client';

import { ReactNode } from 'react';
import { I18nProviderClient } from '../../../locales/client';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <I18nProviderClient fallback={<p> Loading...</p>} fallbackLocale="en">
      {children}
    </I18nProviderClient>
  );
}
