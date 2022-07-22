import { useRouter } from 'next/router';

export function createUseChangeLocale<LocalesType>() {
  return function useChangeLocale() {
    const { push, asPath } = useRouter();

    // TODO: fix typo
    return function changeLocale(newLocale: keyof LocalesType) {
      push(asPath, undefined, { locale: newLocale as string, shallow: true });
    };
  };
}
