import { useRouter, usePathname } from 'next/navigation';
import type { I18nClientConfig } from '../../types';

export function createUseChangeLocale<LocalesKeys>(useCurrentLocale: () => LocalesKeys, config: I18nClientConfig) {
  return function useChangeLocale() {
    const { push, refresh } = useRouter();
    const currentLocale = useCurrentLocale();
    const path = usePathname();

    let pathWithoutLocale = path;

    if (config.basePath) {
      pathWithoutLocale = pathWithoutLocale.replace(config.basePath, '');
    }

    if (pathWithoutLocale.startsWith(`/${currentLocale}/`)) {
      pathWithoutLocale = pathWithoutLocale.replace(`/${currentLocale}/`, '/');
    } else if (pathWithoutLocale === `/${currentLocale}`) {
      pathWithoutLocale = '/';
    }

    return function changeLocale(newLocale: LocalesKeys) {
      push(`/${newLocale}${pathWithoutLocale}`);
      refresh();
    };
  };
}
