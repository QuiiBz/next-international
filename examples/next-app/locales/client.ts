'use client';
import { createI18nClient } from 'next-international/client';
import resources from './resources';

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, defineLocale, useCurrentLocale } =
  createI18nClient(resources);
