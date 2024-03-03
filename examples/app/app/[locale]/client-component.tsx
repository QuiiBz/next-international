'use client';

import React from 'react';
import { useChangeLocale, useI18n, useLocale, useScopedI18n } from '@/locales';

export function ClientComponent() {
  const t = useI18n();
  const scopedT = useScopedI18n('hello');
  const locale = useLocale();
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
