import { getI18n, getScopedI18n } from '@/locales/server';

// Only needed for SSG
export function generateStaticParams() {
  return [
    {
      locale: 'en',
    },
    {
      locale: 'fr',
    },
  ];
}

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const t = await getI18n(locale);
  const t2 = await getScopedI18n(locale, 'scope.more');

  return (
    <div>
      <h1>SSR / SSG</h1>
      <p>
        Current locale: <span>{locale}</span>
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
    </div>
  );
}