'use client';

import { useI18n, useScopedI18n, useChangeLocale, useCurrentLocale } from '../../../locales/client';

export default function Client() {
  const t = useI18n();
  const changeLocale = useChangeLocale();
  const t2 = useScopedI18n('scope.more');
  const locale = useCurrentLocale();

  return (
    <div>
      <h1>SSR + Client Component (No flash)</h1>
      <p>
        Current locale:
        <span>{locale}</span>
      </p>
      <p>Hello: {t('hello')}</p>
      <p>
        Hello:{' '}
        {t('welcome', {
          name: 'John',
        })}
      </p>
      <p>
        Hello (with React components):{' '}
        {t('welcome', {
          name: <strong>John</strong>,
        })}
      </p>
      <p>
        Hello:{' '}
        {t('about.you', {
          age: '23',
          name: 'Doe',
        })}
      </p>
      <p>
        Hello (with React components):{' '}
        {t('about.you', {
          age: <strong>23</strong>,
          name: 'Doe',
        })}
      </p>
      <p>{t2('test')}</p>
      <p>
        {t2('param', {
          param: 'test',
        })}
      </p>
      <p>
        {t2('param', {
          param: <strong>test</strong>,
        })}
      </p>
      <p>{t2('and.more.test')}</p>
      <p>{t('missing.translation.in.fr')}</p>
      <p>
        {t('cows', {
          count: 1,
        })}
      </p>
      <p>
        {t('cows', {
          count: 2,
        })}
      </p>
      <button type="button" onClick={() => changeLocale('en')}>
        EN
      </button>
      <button type="button" onClick={() => changeLocale('fr')}>
        FR
      </button>
    </div>
  );
}
