import { useRouter } from 'next/router';

export function createUseCurrentLocale<LocalesType>(): () => keyof LocalesType {
  return function useCurrentLocale() {
    const { locale } = useRouter();

    return locale as keyof LocalesType;
  };
}
