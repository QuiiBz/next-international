'use client';

// @ts-expect-error - missing import
import React, { use } from 'react';
import { useChangeLocale, getI18n, getLocale, getScopedI18n } from '@/locales';

export function ClientComponent() {
  const t = use(getI18n());
  const scopedT = use(getScopedI18n('hello'));
  const locale = getLocale();
  const changeLocale = useChangeLocale();

  return (
    <div>
      <p>{t('hello.world')}</p>
      <p>{scopedT('world')}</p>
      <p>
        {t('hello.param', {
          name: 'John',
        })}
      </p>
      <p>
        {scopedT('param', {
          name: 'John',
        })}
      </p>
      <p>Current locale: {locale}</p>
      <button
        type="button"
        onClick={() => {
          changeLocale('en');
        }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => {
          changeLocale('fr');
        }}
      >
        FR
      </button>
    </div>
  );
}
