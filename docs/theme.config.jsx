export default {
  logo: <strong>next-international</strong>,
  project: {
    link: 'https://github.com/QuiiBz/next-international',
  },
  docsRepositoryBase: 'https://github.com/QuiiBz/next-international/blob/main/docs/pages',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – next-international'
    }
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
