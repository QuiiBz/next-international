'use client';

import { ReactNode, Suspense } from 'react';
import { I18nProviderClient } from '../../../locales/client';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <I18nProviderClient>{children}</I18nProviderClient>
    </Suspense>
  );
}
