import type { GetServerSideProps } from 'next';
import { getLocaleProps, useChangeLocale, useCurrentLocale, useI18n, useScopedI18n } from '../locales';


export const getServerSideProps: GetServerSideProps = getLocaleProps(['scope2']);
// export const getStaticProps: GetStaticProps = getLocaleProps();

export default function SSR() {
  const t = useI18n();
  const locale = useCurrentLocale();

  return (
    <div>
      <h1>SSR / SSG</h1>
      <p>
        Current locale: <span>{locale}</span>
      </p>
      <p>Hello: {t('scope2.test')}</p>
      <p>Hello: {t('scope2.more.test')}</p>
    </div>
  );
}
