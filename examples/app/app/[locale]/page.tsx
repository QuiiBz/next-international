import React from 'react';
import { getI18n, getLocale, getScopedI18n } from '@/locales';
import { ClientComponent } from './client-component';
import { Suspense } from 'react';

export default async function Home() {
  const t = await getI18n();
  const scopedT = await getScopedI18n('hello');
  const locale = getLocale();

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
      <Suspense>
        <ClientComponent />
      </Suspense>
    </div>
  );
}
