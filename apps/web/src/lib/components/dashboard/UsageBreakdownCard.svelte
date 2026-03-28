<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Progress } from "$lib/components/ui/progress/index.js";
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	type UsageBreakdownItem = {
		id: string;
		label: string;
		detail: string;
		value: number;
	};

	let {
		title,
		description,
		items,
		action,
		class: className,
	}: {
		title: string;
		description?: string;
		items: ReadonlyArray<UsageBreakdownItem>;
		action?: Snippet;
		class?: string;
	} = $props();
</script>

<Card.Root class={cn("grid content-start gap-8", className)}>
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		{#if description}
			<Card.Description>{description}</Card.Description>
		{/if}
		{#if action}
			<Card.Action>
				{@render action()}
			</Card.Action>
		{/if}
	</Card.Header>
	<Card.Content class="grid gap-8">
		{#each items as item (item.id)}
			<div class="grid gap-2">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<h2 class="font-medium">{item.label}</h2>
					<p class="text-muted-foreground text-sm">{item.detail}</p>
				</div>
				<Progress value={item.value} />
			</div>
		{/each}
	</Card.Content>
</Card.Root>
