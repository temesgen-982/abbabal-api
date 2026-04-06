<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	let {
		title,
		meta,
		class: className,
		children,
	}: {
		title?: string;
		meta?: string;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<section class={cn("grid content-start gap-8 bg-panel-background", className)}>
	{#if title || meta}
		<div class="flex items-center justify-between gap-4">
			{#if title}
				<header>{title}</header>
			{/if}
			{#if meta}
				<p class="text-primary">{meta}</p>
			{/if}
		</div>
	{/if}
	{@render children?.()}
</section>
