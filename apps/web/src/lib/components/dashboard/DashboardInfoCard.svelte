<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	let {
		title,
		class: className,
		contentClass,
		action,
		actionClass,
		children,
	}: {
		title: string;
		class?: string;
		contentClass?: string;
		action?: Snippet;
		actionClass?: string;
		children?: Snippet;
	} = $props();
</script>

<Card.Root class={cn(className)}>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		{#if action}
			<Card.Action class={actionClass}>
				{@render action()}
			</Card.Action>
		{/if}
	</Card.Header>
	<Card.Content class={contentClass}>
		{@render children?.()}
	</Card.Content>
</Card.Root>
