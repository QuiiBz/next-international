'use client';

import React from 'react';
import { useI18n, useScopedI18n } from '@/locales';

export function ClientComponent() {
  const t = useI18n();
  const scopedT = useScopedI18n('hello');

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
    </div>
  );
}
