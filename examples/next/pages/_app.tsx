import React from 'react';
import { AppProps } from 'next/app';
import { I18nProvider } from '../locales';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <I18nProvider locale={pageProps.locale} fallback={<p>Loading initial locale client-side</p>}>
      <Component {...pageProps} />
    </I18nProvider>
  );
};

export default App;
