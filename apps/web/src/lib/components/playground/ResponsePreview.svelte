<script lang="ts">
	import { cn } from "$lib/utils.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";

	let {
		class: className,
		headerClass = "flex flex-wrap items-center justify-between gap-4",
		tabsHeaderClass = "flex flex-wrap items-center justify-between gap-4",
		listClass = "",
		actionsPlacement = "tabs",
		defaultTab = "visual",
		visualClass = "",
		jsonClass = "",
		header,
		actions,
		visual,
		json,
	} = $props();
</script>

<Tabs.Root value={defaultTab} class={cn("grid gap-6", className)}>
	{#if header}
		<div class={headerClass}>
			{@render header?.()}
			{#if actions && actionsPlacement === "header"}
				<div class="flex items-center gap-2">
					{@render actions?.()}
				</div>
			{/if}
		</div>
	{/if}

	<div class={tabsHeaderClass}>
		<Tabs.List class={listClass}>
			<Tabs.Trigger value="visual">Visual</Tabs.Trigger>
			<Tabs.Trigger value="json">JSON</Tabs.Trigger>
		</Tabs.List>
		{#if actions && actionsPlacement === "tabs"}
			<div class="flex items-center gap-2">
				{@render actions?.()}
			</div>
		{/if}
	</div>

	<Tabs.Content value="visual" class={visualClass}>
		{@render visual?.()}
	</Tabs.Content>

	<Tabs.Content value="json" class={jsonClass}>
		{@render json?.()}
	</Tabs.Content>
</Tabs.Root>
