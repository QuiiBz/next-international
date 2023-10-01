'use client';

import { useChangeLocale } from '../../locales/client';

export function Switch() {
  const changeLocale = useChangeLocale({ preserveSearchParams: true });

  return (
    <>
      <button type="button" onClick={() => changeLocale('en')}>
        EN
      </button>
      <button type="button" onClick={() => changeLocale('fr')}>
        FR
      </button>
    </>
  );
}
