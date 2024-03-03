import { generateI18nStaticParams } from '@/locales';
import type React from 'react';

export const dynamicParams = false;
export function generateStaticParams() {
  return generateI18nStaticParams();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
