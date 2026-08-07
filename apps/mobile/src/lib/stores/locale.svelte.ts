import { loadLocale } from 'wuchale/load-utils';
import { locales, type Locale } from '../../locales/data.js';

// so that the loaders are registered
import '../../locales/main.loader.svelte.js';

const STORAGE_KEY = 'abbabal.locale';

function initialLocale(): Locale {
	if (typeof window === 'undefined') return 'en';
	try {
		const saved = window.localStorage.getItem(STORAGE_KEY);
		if (saved && (locales as readonly string[]).includes(saved)) return saved as Locale;
	} catch {
		// ignore
	}
	return 'en';
}

let locale = $state<Locale>(initialLocale());

export function getLocaleState() {
	function apply(next: string) {
		locale = (next === 'am' ? 'am' : 'en');
		if (typeof window !== 'undefined') {
			document.documentElement.lang = locale;
			try {
				window.localStorage.setItem(STORAGE_KEY, locale);
			} catch {
				// ignore
			}
		}
	}

	return {
		get value() {
			return locale;
		},
		set(next: string) {
			apply(next);
			loadLocale(locale);
		},
	};
}

export async function initLocale() {
	const next = initialLocale();
	locale = next;
	if (typeof window !== 'undefined') {
		document.documentElement.lang = next;
	}
	await loadLocale(next);
}
