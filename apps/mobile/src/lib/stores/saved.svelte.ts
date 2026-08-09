import { browser } from '$app/environment';
import type { Proverb } from '$lib/api';

const STORAGE_KEY = 'abbabal.saved';

function load(): Proverb[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? (JSON.parse(raw) as Proverb[]) : [];
	} catch {
		return [];
	}
}

let saved = $state<Proverb[]>(load());

export function getSavedState() {
	function persist() {
		if (browser) localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
	}

	return {
		get items() {
			return saved;
		},
		has(id: number) {
			return saved.some((p) => p.id === id);
		},
		toggle(proverb: Proverb) {
			const idx = saved.findIndex((p) => p.id === proverb.id);
			if (idx >= 0) {
				saved.splice(idx, 1);
			} else {
				saved = [proverb, ...saved];
			}
			persist();
		},
		remove(id: number) {
			saved = saved.filter((p) => p.id !== id);
			persist();
		},
		clear() {
			saved = [];
			persist();
		},
	};
}
