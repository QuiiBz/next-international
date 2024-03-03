import type { GetLocale, LocaleType, LocalesObject } from 'international-types';
import type {
  CreateI18n,
  GenerateI18nStaticParams,
  I18nConfig,
  UseChangeLocale,
  UseI18n,
  UseLocale,
  UseScopedI18n,
} from './types';
import { SEGMENT_NAME } from './constants';
import { useParams, useRouter } from 'next/navigation';

function useLocaleCache() {
  const params = useParams();
  const locale = params.locale;

  if (typeof locale !== 'string') {
    throw new Error('Invariant: locale params is not a string: ' + JSON.stringify(params, null, 2));
  }

  return locale;
}

export function createI18n<Locales extends LocalesObject, Locale extends LocaleType = GetLocale<Locales>>(
  locales: Locales,
  config: I18nConfig = {},
): CreateI18n<Locales, Locale> {
  const useI18n: UseI18n<Locale> = () => {
    const locale = useLocaleCache();

    return (key, ...params) => {
      return 'client: ' + locale;
    };
  };

  const useScopedI18n: UseScopedI18n<Locale> = scope => {
    const locale = useLocaleCache();

    return (key, ...params) => {
      return 'client: ' + locale;
    };
  };

  const generateI18nStaticParams: GenerateI18nStaticParams = () => {
    return Object.keys(locales).map(locale => ({ [config.segmentName ?? SEGMENT_NAME]: locale }));
  };

  const useLocale: UseLocale<Locales> = () => {
    return useLocaleCache();
  };

  const useChangeLocale: UseChangeLocale<Locales> = () => {
    const router = useRouter();

    return locale => {
      // TODO: preserve URL & search params
      router.push(`/${locale as string}`);
    };
  };

  return {
    useI18n,
    useScopedI18n,
    generateI18nStaticParams,
    useLocale,
    useChangeLocale,
  };
}
