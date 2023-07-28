import { createI18nServer } from 'next-international/server';
import resources from './resources';

export const { getI18n, getScopedI18n, getCurrentLocale, getStaticParams } = createI18nServer(resources);
