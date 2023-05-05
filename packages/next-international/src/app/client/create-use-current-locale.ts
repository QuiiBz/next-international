import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function createUseCurrentLocale<LocalesKeys>(locales: LocalesKeys[]): () => LocalesKeys {
  return function useCurrentLocale() {
    const path = usePathname();

    return useMemo(() => {
      for (const locale of locales) {
        if (path.startsWith(`/${locale}`)) {
          return locale;
        }
      }

      throw new Error('Locale not found');
    }, [path]);
  };
}
