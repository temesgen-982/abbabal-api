<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	let {
		title,
		subtitle,
		class: className,
		children,
	}: {
		title: string;
		subtitle?: string;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div class={cn("relative w-full max-w-lg", className)}>
	<div
		aria-hidden="true"
		class="paper-layer paper-layer-back absolute inset-0 rotate-[-1.5deg] shadow-sm"
	></div>
	<div
		aria-hidden="true"
		class="paper-layer paper-layer-mid absolute inset-0 rotate-[1deg] shadow-md"
	></div>

	<section class="paper-surface paper-edge relative border border-primary/10 p-8 sm:p-10">
		<header class="mb-8 text-center">
			<h1 class="text-primary mb-2 text-3xl font-black tracking-tight">{title}</h1>
			<div class="harag-divider mx-auto mb-6 w-24"></div>
			{#if subtitle}
				<p class="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.24em]">
					{subtitle}
				</p>
			{/if}
		</header>

		{@render children?.()}
	</section>
</div>

<style>
	.paper-layer,
	.paper-surface {
		background-repeat: no-repeat, repeat;
		background-size: auto, 180px 180px;
		background-position: 0 0, 0 0;
	}

	.paper-layer {
		background-image:
			linear-gradient(180deg, rgb(255 255 255 / 0.22), rgb(239 232 219 / 0.1)),
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='layer-noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23layer-noise)' opacity='.05'/%3E%3C/svg%3E");
	}

	.paper-layer-back {
		background-color: rgb(244 239 228 / 0.9);
	}

	.paper-layer-mid {
		background-color: rgb(239 232 219 / 0.95);
	}

	.paper-surface {
		background-color: rgb(245 240 225 / 0.98);
		background-image:
			linear-gradient(180deg, rgb(255 255 255 / 0.3), rgb(244 239 228 / 0.12)),
			url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Cfilter id='surface-noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23surface-noise)' opacity='.06'/%3E%3C/svg%3E");
		backdrop-filter: blur(2px);
	}

	.paper-edge {
		box-shadow:
			2px 3px 15px rgb(0 0 0 / 0.2),
			inset 0 0 15px rgb(168 33 26 / 0.05);
	}

	.paper-edge::after {
		content: "";
		position: absolute;
		inset: 0;
		pointer-events: none;
		border: 1px solid rgb(168 33 26 / 0.1);
		mask-image: linear-gradient(
			to bottom,
			black,
			transparent 1px,
			transparent calc(100% - 1px),
			black
		);
	}

	.harag-divider {
		height: 8px;
		background-image: radial-gradient(circle, #d4af37 2px, transparent 2.5px);
		background-size: 12px 100%;
		opacity: 0.6;
	}
</style>
