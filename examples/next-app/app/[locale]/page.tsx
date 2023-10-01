import { setStaticParamsLocale } from 'next-international/server';
import { getI18n, getScopedI18n, getCurrentLocale } from '../../locales/server';
import Client from './client';
import { Provider } from './provider';

// Uncomment to test Static Generation on this page only
// export function generateStaticParams() {
//   return getStaticParams();
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  // Uncomment to test Static Generation
  setStaticParamsLocale(locale);

  const t = await getI18n();
  const t2 = await getScopedI18n('scope.more');
  const currentLocale = getCurrentLocale();

  return (
    <div>
      <Provider>
        <Client />
      </Provider>
      <h1>SSR / SSG</h1>
      <p>
        Current locale:
        <span>{currentLocale}</span>
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
      <p>
        {t2('stars', {
          count: 1,
        })}
      </p>
      <p>
        {t2('stars', {
          count: 2,
        })}
      </p>
    </div>
  );
}
