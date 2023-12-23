import { warn } from '../../helpers/log';
import type { ImportedLocales } from 'international-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { I18nChangeLocaleConfig, I18nClientConfig } from '../../types';
import { localesCache } from './create-i18n-provider-client';

export function createUseChangeLocale<LocalesKeys>(
  useCurrentLocale: () => LocalesKeys,
  locales: ImportedLocales,
  config: I18nClientConfig,
) {
  return function useChangeLocale(changeLocaleConfig?: I18nChangeLocaleConfig) {
    const { push, refresh } = useRouter();
    const currentLocale = useCurrentLocale();
    const path = usePathname();
    // We call the hook conditionally to avoid always opting out of Static Rendering.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const searchParams = changeLocaleConfig?.preserveSearchParams ? useSearchParams().toString() : undefined;
    const finalSearchParams = searchParams ? `?${searchParams}` : '';

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
      const importFnLocale = locales[newLocale as keyof typeof locales];
      if (!importFnLocale) {
        warn(`The locale '${newLocale}' is not supported.`);
        return;
      }

      importFnLocale().then(module => {
        localesCache.set(newLocale as string, module.default);
        push(`/${newLocale}${pathWithoutLocale}${finalSearchParams}`);
        refresh();
      });
    };
  };
}
