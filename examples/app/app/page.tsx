import React from 'react';
import { useI18n, useScopedI18n } from '@/locales';
import { ClientComponent } from './client-component';

export default function Home() {
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
      <ClientComponent />
    </div>
  );
}
