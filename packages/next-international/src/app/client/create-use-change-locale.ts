import { useRouter, usePathname } from 'next/navigation';

export function createUseChangeLocale<LocalesKeys>() {
  return function useChangeLocale() {
    const { push } = useRouter();
    const path = usePathname();

    return function changeLocale(newLocale: LocalesKeys) {
      // @ts-expect-error TODO
      push(path, undefined, { locale: newLocale as unknown as string, shallow: true });
    };
  };
}
