'use client';

import { ReactElement } from 'react';
import { I18nProviderClient } from '../../locales/client';

export function Provider({ children }: { children: ReactElement }) {
  return <I18nProviderClient>{children}</I18nProviderClient>;
}
