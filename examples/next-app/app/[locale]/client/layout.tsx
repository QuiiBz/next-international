import type { ReactNode } from 'react';
import { Provider } from '../provider';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}) {
  const { locale } = await params;

  return <Provider locale={locale}>{children}</Provider>;
}
