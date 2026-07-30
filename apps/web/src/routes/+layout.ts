import type { LayoutLoad } from './$types';
import { locales, type Locale } from '../locales/data.js';
import { browser } from '$app/environment';
import { loadLocale } from 'wuchale/load-utils';

import '../locales/main.loader.svelte.js';
import '../locales/js.loader.js';

export const load: LayoutLoad = async ({ url }) => {
  const locale = (url.searchParams.get('locale') ?? 'en') as Locale;
  if (locales.includes(locale) && browser) {
    await loadLocale(locale);
  }
  return { locale };
};
