import React from 'react';
import type { AppProps } from 'next/app';
import { I18nProvider } from '../locales';
import en from '../locales/en';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <I18nProvider locale={pageProps.locale} fallback={<p>Loading initial locale client-side</p>} fallbackLocale={en}>
      <Component {...pageProps} />
    </I18nProvider>
  );
};

export default App;
