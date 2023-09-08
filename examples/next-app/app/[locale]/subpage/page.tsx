// import { setStaticParamsLocale } from 'next-international/server';
import { getI18n } from '../../../locales/server';

export default async function Subpage({ params: { locale } }: { params: { locale: string } }) {
  // Uncomment to test Static Generation
  // setStaticParamsLocale(locale);

  const t = await getI18n();

  return (
    <div>
      <h1>SSR / SSG</h1>
      <p>Hello: {t('hello')}</p>
    </div>
  );
}
