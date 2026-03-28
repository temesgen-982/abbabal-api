<script lang="ts">
	import DashboardInfoCard from "$lib/components/dashboard/DashboardInfoCard.svelte";
	import HaragDivider from "$lib/components/dashboard/HaragDivider.svelte";
	import LinearChart from "$lib/components/dashboard/LinearChart.svelte";
	import UsageBreakdownCard from "$lib/components/dashboard/UsageBreakdownCard.svelte";
	import * as Select from "$lib/components/ui/select/index.js";

	type UsageMetric = {
		title: string;
		value: string;
		note: string;
	};

	type UsagePoint = {
		date: Date;
		requests: number;
	};

	type UsageBreakdownItem = {
		id: string;
		label: string;
		detail: string;
		value: number;
	};

	const summaryMetrics = [
		{
			title: "Avg. Response Time",
			value: "182ms",
			note: "Mock rolling 7-day average",
		},
		{
			title: "Error Rate",
			value: "1.8%",
			note: "Mock failed requests across all keys",
		},
		{
			title: "Successful Requests",
			value: "12,438",
			note: "Mock requests served this month",
		},
	] as const satisfies ReadonlyArray<UsageMetric>;

	const requestVolume = [
		{ date: new Date("2026-03-15"), requests: 148 },
		{ date: new Date("2026-03-16"), requests: 162 },
		{ date: new Date("2026-03-17"), requests: 154 },
		{ date: new Date("2026-03-18"), requests: 171 },
		{ date: new Date("2026-03-19"), requests: 168 },
		{ date: new Date("2026-03-20"), requests: 176 },
		{ date: new Date("2026-03-21"), requests: 193 },
		{ date: new Date("2026-03-22"), requests: 205 },
		{ date: new Date("2026-03-23"), requests: 198 },
		{ date: new Date("2026-03-24"), requests: 214 },
		{ date: new Date("2026-03-25"), requests: 221 },
		{ date: new Date("2026-03-26"), requests: 216 },
		{ date: new Date("2026-03-27"), requests: 232 },
	] as const satisfies ReadonlyArray<UsagePoint>;

	const apiKeyFilters = [
		{ value: "all-keys", label: "All Keys" },
		{ value: "production", label: "Production" },
		{ value: "staging", label: "Staging" },
	] as const;

	type ApiKeyFilter = (typeof apiKeyFilters)[number]["value"];

	const endpointUsageByFilter = {
		"all-keys": [
			{ id: "random", label: "/random", detail: "44% of mock requests", value: 44 },
			{ id: "search", label: "/search", detail: "31% of mock requests", value: 31 },
			{ id: "daily", label: "/daily", detail: "18% of mock requests", value: 18 },
			{ id: "featured", label: "/featured", detail: "7% of mock requests", value: 7 },
		],
		production: [
			{ id: "random", label: "/random", detail: "52% of production traffic", value: 52 },
			{ id: "search", label: "/search", detail: "28% of production traffic", value: 28 },
			{ id: "daily", label: "/daily", detail: "14% of production traffic", value: 14 },
			{ id: "featured", label: "/featured", detail: "6% of production traffic", value: 6 },
		],
		staging: [
			{ id: "search", label: "/search", detail: "41% of staging traffic", value: 41 },
			{ id: "random", label: "/random", detail: "27% of staging traffic", value: 27 },
			{ id: "daily", label: "/daily", detail: "19% of staging traffic", value: 19 },
			{ id: "debug", label: "/debug", detail: "13% of staging traffic", value: 13 },
		],
	} as const satisfies Record<ApiKeyFilter, ReadonlyArray<UsageBreakdownItem>>;

	const usageByApiKey = [
		{
			id: "production",
			label: "Production",
			detail: "620 of 1000 mock calls",
			value: 62,
		},
		{
			id: "staging",
			label: "Staging",
			detail: "270 of 1000 mock calls",
			value: 27,
		},
		{
			id: "internal-tools",
			label: "Internal Tools",
			detail: "110 of 1000 mock calls",
			value: 11,
		},
	] as const satisfies ReadonlyArray<UsageBreakdownItem>;

	let selectedApiKeyFilter = $state<ApiKeyFilter>("all-keys");

	const selectedApiKeyFilterLabel = $derived(
		apiKeyFilters.find((filter) => filter.value === selectedApiKeyFilter)?.label ?? "All Keys",
	);

	const usageByEndpoint = $derived(endpointUsageByFilter[selectedApiKeyFilter]);
</script>

<section class="grid gap-3">
	<p class="text-muted-foreground text-sm uppercase tracking-[0.18em]">Preview</p>
	<div class="grid gap-2">
		<h1 class="text-3xl">Usage and Analytics</h1>
		<p class="text-muted-foreground max-w-2xl">
			This route is using named mock datasets for now, so we can shape the UI contract
			before the backend usage endpoints exist.
		</p>
	</div>
</section>

<HaragDivider class="my-6" />

<section class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
	{#each summaryMetrics as metric}
		<DashboardInfoCard class="grow" title={metric.title}>
			<div class="grid gap-2">
				<p class="text-3xl font-medium tracking-tight">{metric.value}</p>
				<p class="text-muted-foreground text-sm">{metric.note}</p>
			</div>
		</DashboardInfoCard>
	{/each}
</section>

<LinearChart data={requestVolume} />

<div class="grid gap-8 xl:grid-cols-2">
	<UsageBreakdownCard
		title="Usage by Endpoint"
		description={`Mock request split for ${selectedApiKeyFilterLabel.toLowerCase()}.`}
		items={usageByEndpoint}
	>
		{#snippet action()}
			<Select.Root type="single" bind:value={selectedApiKeyFilter}>
				<Select.Trigger class="w-[180px]">{selectedApiKeyFilterLabel}</Select.Trigger>
				<Select.Content>
					{#each apiKeyFilters as filter (filter.value)}
						<Select.Item value={filter.value}>{filter.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{/snippet}
	</UsageBreakdownCard>

	<UsageBreakdownCard
		title="Usage by API Key"
		description="Mock request allocation across your current keys."
		items={usageByApiKey}
	/>
</div>
