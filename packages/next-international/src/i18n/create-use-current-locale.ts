import { useRouter } from 'next/router';

export function createUseCurrentLocale<LocalesKeys>(): () => LocalesKeys {
  return function useCurrentLocale() {
    const { locale } = useRouter();

    return locale as unknown as LocalesKeys;
  };
}
