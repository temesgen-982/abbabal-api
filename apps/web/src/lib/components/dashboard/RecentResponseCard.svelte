<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from "$lib/utils.js";

	let {
		indexLabel,
		title,
		subtitle,
		timeLabel,
		statusLabel,
		class: className,
		statusClass = "bg-green-100 text-green-700",
	}: {
		indexLabel: string;
		title: string;
		subtitle: string;
		timeLabel: string;
		statusLabel: string;
		class?: string;
		statusClass?: string;
	} = $props();
</script>

<Card.Root
	class={cn(
		"border-primary relative border-l-4 shadow-sm transition-transform duration-300 hover:rotate-0",
		"rotate-[0.3deg]",
		className,
	)}
>
	<Card.Content class="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div
			class="border text-primary font-ethiopic flex h-12 w-12 flex-shrink-0 items-center justify-center rounded text-2xl font-bold"
		>
			{indexLabel}
		</div>
		<div class="min-w-0 grow">
			<h2 class="text-xl">{title}</h2>
			<p>{subtitle}</p>
		</div>
		<div class="w-full text-left sm:ml-auto sm:w-auto sm:flex-shrink-0 sm:text-right">
			<p class="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
				{timeLabel}
			</p>
			<span
				class={cn(
					"inline-block rounded px-2 py-1 text-[9px] font-black uppercase",
					statusClass,
				)}
			>
				{statusLabel}
			</span>
		</div>
	</Card.Content>
</Card.Root>
