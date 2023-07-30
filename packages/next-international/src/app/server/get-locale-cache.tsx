import { cookies, headers } from 'next/headers';
import { cache } from 'react';

import { LOCALE_COOKIE, LOCALE_HEADER } from '../../common/constants';

export const getLocaleCache = cache(() => {
  let locale: string | undefined | null;

  locale = headers().get(LOCALE_HEADER);

  if (!locale) {
    locale = cookies().get(LOCALE_COOKIE)?.value;
  }

  if (!locale) {
    throw new Error('Could not get the locale from the headers or cookies.');
  }

  return locale;
});
