<script lang="ts">
	import { Copy } from "@lucide/svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import { cn } from "$lib/utils.js";

	let {
		title,
		value,
		class: className,
		oncopy,
	}: {
		title: string;
		value: string;
		class?: string;
		oncopy?: (event: MouseEvent) => void;
	} = $props();
</script>

<Card.Root class={cn(className)}>
	<Card.Content class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
		<div class="grid min-w-0 gap-1">
			<p class="font-medium">{title}</p>
			<p class="text-muted-foreground truncate text-sm">{value}</p>
		</div>
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			aria-label={`Copy ${title}`}
			title={`Copy ${title}`}
			onclick={oncopy}
		>
			<Copy />
		</Button>
	</Card.Content>
</Card.Root>
