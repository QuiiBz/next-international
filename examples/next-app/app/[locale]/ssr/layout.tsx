import { ReactNode } from 'react';
import { I18nProviderClient } from '../../../locales/client';
import { Locale, resources } from '../../../locales/resources';

export default async function Layout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const resource = await resources[locale]().then(content => content.default);
  return (
    <I18nProviderClient locale={locale} resource={resource}>
      {children}
    </I18nProviderClient>
  );
}
