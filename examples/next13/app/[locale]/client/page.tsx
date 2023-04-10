'use client';

import { useI18n } from '@/locales/client';

export default function Client() {
  const t = useI18n();
  return <div>{t('hello')}</div>;
}
