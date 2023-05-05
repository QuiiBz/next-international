import { useRouter, usePathname } from 'next/navigation';

export function createUseChangeLocale<LocalesKeys>(locales: string[]) {
  return function useChangeLocale() {
    const { push } = useRouter();
    const path = usePathname();

    let pathWithoutLocale = path;

    locales.forEach(locale => {
      pathWithoutLocale = pathWithoutLocale.replace(`/${locale}`, '');
    });

    return function changeLocale(newLocale: LocalesKeys) {
      push(`/${newLocale}${pathWithoutLocale}`);
    };
  };
}
