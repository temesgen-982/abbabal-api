<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { Route } from './$types';
	import { House, Search, Shuffle, Bookmark, User } from '@lucide/svelte';

	let { children } = $props();

	const tabs = [
		{ href: '/', label: 'Home', icon: House },
		{ href: '/search', label: 'Search', icon: Search },
		{ href: '/random', label: 'Random', icon: Shuffle },
		{ href: '/saved', label: 'Saved', icon: Bookmark },
		{ href: '/profile', label: 'Profile', icon: User }
	];
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-background">
	<main class="flex-1 pb-20">
		{@render children()}
	</main>

	<!-- Bottom Nav -->
	<nav
		class="fixed right-4 bottom-4 left-4 z-30 flex h-16 items-stretch overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
	>
		{#each tabs as tab (tab.href)}
			{@const active = page.url.pathname === tab.href}
			<a
				href={resolve(tab.href as Route)}
				class="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors
               {active ? 'text-primary' : 'text-muted-foreground'}"
			>
				<tab.icon size={20} />
				<span class="text-[10px] font-medium">{tab.label}</span>
				{#if active}
					<span class="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary"></span>
				{/if}
			</a>
		{/each}
	</nav>
</div>
