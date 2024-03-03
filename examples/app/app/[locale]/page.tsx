import React from 'react';
import { useI18n, useLocale, useScopedI18n } from '@/locales';
import { ClientComponent } from './client-component';

export default function Home() {
  const t = useI18n();
  const scopedT = useScopedI18n('hello');
  const locale = useLocale();

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
      <hr />
      <ClientComponent />
    </div>
  );
}
