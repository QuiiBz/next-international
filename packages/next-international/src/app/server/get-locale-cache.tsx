import { cookies, headers } from 'next/headers';
import { cache, createServerContext, use, useContext } from 'react';
import { LOCALE_COOKIE, LOCALE_HEADER } from '../../common/constants';
import { notFound } from 'next/navigation';
import { error } from '../../helpers/log';

export const ServerContext = createServerContext<null | string>('locale', null);

export const getLocaleCache = () => {
  let locale: string | undefined | null;
  const localeCache = useContext(ServerContext);

  try {
    locale = headers().get(LOCALE_HEADER);

    if (!locale) {
      locale = cookies().get(LOCALE_COOKIE)?.value;
    }
  } catch (e) {
    console.log('GET', { localeCache });
    locale = localeCache ?? 'en';
  }

  if (!locale) {
    error(`Locale not found in headers or cookies, returning "notFound()"`);
    notFound();
  }

  return locale;
};
