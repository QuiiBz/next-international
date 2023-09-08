import { useRouter, usePathname } from 'next/navigation';
import type { I18nClientConfig } from '../../types';

export function createUseChangeLocale<LocalesKeys>(locales: LocalesKeys[], config: I18nClientConfig) {
  return function useChangeLocale() {
    const { push, refresh } = useRouter();
    const path = usePathname();

    let pathWithoutLocale = path;

    if (config.basePath) {
      pathWithoutLocale = pathWithoutLocale.replace(config.basePath, '');
    }

    locales.forEach(locale => {
      pathWithoutLocale = pathWithoutLocale.replace(`/${locale}`, '');
    });

    return function changeLocale(newLocale: LocalesKeys) {
      push(`/${newLocale}${pathWithoutLocale}`);
      refresh();
    };
  };
}
