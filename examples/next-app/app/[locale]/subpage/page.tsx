// import { setStaticParamsLocale } from 'next-international/server';
import { getI18n } from '../../../locales/server';

// Uncomment to test Static Generation on this page only
// export function generateStaticParams() {
//   return getStaticParams();
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
