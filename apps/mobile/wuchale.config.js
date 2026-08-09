// @ts-check
import { defineConfig } from 'wuchale';
import { adapter as svelte } from '@wuchale/svelte';

export default defineConfig({
  locales: ['en', 'am'],
  adapters: {
    main: svelte({
      loader: 'svelte',
    }),
  },
});
