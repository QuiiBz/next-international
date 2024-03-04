import { generateI18nStaticParams } from '@/locales';
import React from 'react';

export const dynamicParams = false;
export function generateStaticParams() {
  return generateI18nStaticParams();
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
