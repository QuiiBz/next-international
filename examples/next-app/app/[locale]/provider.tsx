'use client';

import { ReactElement, Suspense } from 'react';
import { I18nProviderClient } from '../../locales/client';

export function Provider({ children }: { children: ReactElement }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <I18nProviderClient>{children}</I18nProviderClient>
    </Suspense>
  );
}
