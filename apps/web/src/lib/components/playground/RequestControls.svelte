<script lang="ts">
	import { cn } from "$lib/utils.js";
	import * as Select from "$lib/components/ui/select/index.js";

	type Option = {
		value: string;
		label: string;
	};

	let {
		class: className,
		endpointOptions,
		apiKeyOptions,
		endpointLabel = "Endpoint",
		apiKeyLabel = "API key",
		limitLabel = "Limit",
		selectedEndpoint = $bindable(),
		selectedApiKey = $bindable(),
		limit = $bindable(1),
		labelClass = "grid gap-2 text-sm font-medium",
		triggerClass = "w-full",
		limitWrapperClass = "grid gap-2 text-sm font-medium",
		limitLabelClass = "text-sm font-medium",
		limitValueClass =
			"bg-muted text-foreground inline-flex h-7 w-10 items-center justify-center rounded-full text-xs",
		rangeClass =
			"h-1.5 w-full cursor-pointer appearance-none rounded-full bg-primary/20 accent-primary",
		limitLayout = "stacked",
	}: {
		class?: string;
		endpointOptions: Option[];
		apiKeyOptions: Option[];
		endpointLabel?: string;
		apiKeyLabel?: string;
		limitLabel?: string;
		selectedEndpoint: Option["value"];
		selectedApiKey: Option["value"];
		limit: number;
		labelClass?: string;
		triggerClass?: string;
		limitWrapperClass?: string;
		limitLabelClass?: string;
		limitValueClass?: string;
		rangeClass?: string;
		limitLayout?: "stacked" | "inline";
	} = $props();

	const selectedEndpointLabel = $derived(
		endpointOptions.find((option) => option.value === selectedEndpoint)?.label ??
			endpointOptions[0]?.label ??
			"",
	);
	const selectedApiKeyLabel = $derived(
		apiKeyOptions.find((option) => option.value === selectedApiKey)?.label ??
			apiKeyOptions[0]?.label ??
			"",
	);
</script>

<div class={cn("grid gap-6", className)}>
	<label class={labelClass}>
		{endpointLabel}
		<Select.Root type="single" bind:value={selectedEndpoint}>
			<Select.Trigger class={triggerClass}>{selectedEndpointLabel}</Select.Trigger>
			<Select.Content>
				{#each endpointOptions as option (option.value)}
					<Select.Item value={option.value}>{option.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</label>

	<label class={labelClass}>
		{apiKeyLabel}
		<Select.Root type="single" bind:value={selectedApiKey}>
			<Select.Trigger class={triggerClass}>{selectedApiKeyLabel}</Select.Trigger>
			<Select.Content>
				{#each apiKeyOptions as option (option.value)}
					<Select.Item value={option.value}>{option.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</label>

	<div class={limitWrapperClass}>
		{#if limitLayout === "inline"}
			<span class={limitLabelClass}>{limitLabel}</span>
			<div class="flex items-center gap-4">
				<input
					class={rangeClass}
					type="range"
					min="1"
					max="10"
					bind:value={limit}
				/>
				<span class={limitValueClass}>{limit}</span>
			</div>
		{:else}
			<div class="flex items-center justify-between">
				<span class={limitLabelClass}>{limitLabel}</span>
				<span class={limitValueClass}>{limit}</span>
			</div>
			<input
				class={rangeClass}
				type="range"
				min="1"
				max="10"
				bind:value={limit}
			/>
		{/if}
	</div>
</div>
