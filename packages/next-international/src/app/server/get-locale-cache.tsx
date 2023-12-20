import { cookies, headers } from 'next/headers';
// @ts-expect-error - no types
import { cache } from 'react';
import { LOCALE_COOKIE, LOCALE_HEADER } from '../../common/constants';
import { notFound } from 'next/navigation';
import { error } from '../../helpers/log';

const getLocale = cache<() => { current: string | undefined }>(() => ({ current: undefined }));
const getStaticParamsLocale = () => getLocale().current;

export const setStaticParamsLocale = (value: string) => {
  getLocale().current = value;
};

export const getLocaleCache = cache(() => {
  let locale: string | undefined | null;

  locale = getStaticParamsLocale();

  if (!locale) {
    try {
      locale = headers().get(LOCALE_HEADER);

      if (!locale) {
        locale = cookies().get(LOCALE_COOKIE)?.value;
      }
    } catch (e) {
      throw new Error(
        'Could not find locale while pre-rendering page, make sure you called `setStaticParamsLocale` at the top of your pages',
      );
    }
  }

  if (!locale) {
    error(`Locale not found in headers or cookies, returning "notFound()"`);
    notFound();
  }

  return locale;
});
