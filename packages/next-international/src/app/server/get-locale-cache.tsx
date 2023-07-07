import { cookies, headers } from 'next/headers';
import { cache } from 'react';

export const getLocaleCache = cache(() => {
  let locale: string | undefined | null;

  locale = headers().get('X-Next-Locale');

  if (!locale) {
    locale = cookies().get('Next-Locale')?.value;
  }

  if (!locale) {
    throw new Error('Could not get the locale from the headers or cookies.');
  }

  return locale;
});
