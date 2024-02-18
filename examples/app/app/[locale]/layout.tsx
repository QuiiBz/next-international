import { I18nProvider, generateI18nStaticParams } from '@/locales';
import React from 'react';

export const dynamicParams = false;
export function generateStaticParams() {
  return generateI18nStaticParams();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
