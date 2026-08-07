import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { initLocale } from '$lib/stores/locale.svelte';
import { BASE_URL } from '$lib/api';
import { getLastSyncAt, syncDatabase } from '$lib/db';

export const prerender = true;
export const ssr = false;

const SYNC_STALE_MS = 24 * 60 * 60 * 1000;

export const load: LayoutLoad = async () => {
	if (browser) {
		await initLocale();
		maybeSync();
	}
	return {};
};

async function maybeSync() {
	const last = getLastSyncAt();
	if (last && Date.now() - new Date(last).getTime() < SYNC_STALE_MS) return;
	syncDatabase(BASE_URL).catch(() => {});
}
