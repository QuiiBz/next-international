import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import { LOCALE_COOKIE, LOCALE_HEADER } from '../../common/constants';
import { notFound } from 'next/navigation';
import { error } from '../../helpers/log';

export const getLocaleCache = cache(() => {
  let locale: string | undefined | null;

  try {
    locale = headers().get(LOCALE_HEADER);

    if (!locale) {
      locale = cookies().get(LOCALE_COOKIE)?.value;
    }
  } catch (e) {
    console.log('FAIL');
    locale = 'en';
  }

  if (!locale) {
    console.log('404');
    error(`Locale not found in headers or cookies, returning "notFound()"`);
    notFound();
  }

  return locale;
});
