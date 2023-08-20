import { useConfig } from 'nextra-theme-docs'
import Image from 'next/image';

export default {
  logo: (
    <>
      <Image src="/logo-black.png" alt="next-international logo" height="24" width="24" />
      <strong style={{ marginLeft: '8px' }}>next-international</strong>
    </>
  ),
  head: () => {
    const { title } = useConfig();
    const socialCard = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/og.jpg' : 'https://next-international.vercel.app/og.jpg';

    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="description" content="Type-safe internationalization (i18n) for Next.js" />
        <meta property="og:description" content="Type-safe internationalization (i18n) for Next.js" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="" />
        <meta name="twitter:site:domain" content="next-international.vercel.app" />
        <meta name="twitter:url" content="https://next-international.vercel.app" />
        <meta name="og:title" content={title ?? 'next-international'} />
        <meta name="og:image" content={socialCard} />
      </>
    );
  },
  project: {
    link: 'https://github.com/QuiiBz/next-international',
  },
  docsRepositoryBase: 'https://github.com/QuiiBz/next-international/blob/main/docs/pages',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – next-international',
    };
  },
  footer: {
    text: <span>MIT {new Date().getFullYear()} © next-international contributors.</span>,
  },
  darkMode: false,
  nextThemes: {
    defaultTheme: 'light',
    forcedTheme: 'light',
  },
};
