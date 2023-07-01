import { GetServerSideProps } from 'next';
import { getLocaleProps, useChangeLocale, useCurrentLocale, useI18n, useScopedI18n } from '../locales';

export const getServerSideProps: GetServerSideProps = getLocaleProps();
// export const getStaticProps: GetStaticProps = getLocaleProps();

export default function SSR() {
  const t = useI18n();
  const changeLocale = useChangeLocale();
  const t2 = useScopedI18n('scope.more');
  const locale = useCurrentLocale();

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
      <p>{t2('test')}</p>
      <p>
        {t2('param', {
          param: 'test',
        })}
      </p>
      <p>{t2('and.more.test')}</p>
      <p>{t('missing.translation.in.fr')}</p>
      <button type="button" onClick={() => changeLocale('en')}>
        EN
      </button>
      <button type="button" onClick={() => changeLocale('fr')}>
        FR
      </button>
    </div>
  );
}
