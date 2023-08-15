import Image from 'next/image';

export default {
  logo: (
    <>
      <Image src="/logo-black.png" alt="next-international logo" height="24" width="24" />
      <strong style={{ marginLeft: '8px' }}>next-international</strong>
    </>
  ),
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
    text: (
      <span>
        MIT {new Date().getFullYear()} © next-international contributors.
      </span>
    )
  },
  darkMode: false,
};
