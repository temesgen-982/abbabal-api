<script lang="ts">
	import DashboardApiKeyCard from "$lib/components/dashboard/DashboardApiKeyCard.svelte";
	import DashboardInfoCard from "$lib/components/dashboard/DashboardInfoCard.svelte";
	import DashboardPanel from "$lib/components/dashboard/DashboardPanel.svelte";
	import HaragDivider from "$lib/components/dashboard/HaragDivider.svelte";
	import RecentResponseCard from "$lib/components/dashboard/RecentResponseCard.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
    import { Plus } from "@lucide/svelte";
	import type { PageData } from "./$types";

	const metrics = [
		{ title: "Volume", content: "Card Content" },
		{ title: "Accuracy", content: "Card Content" },
		{ title: "Speed", content: "Card Content" },
	] as const;

	const apiKeys = [
		{ title: "Production Key", value: "abb_**********************782" },
		{ title: "Dev Key", value: "abb_**********************790" },
	] as const;

	const recentResponses = [
		{
			id: "bad-neighbor",
			indexLabel: "፩",
			title: "ከመጥፎ ጎረቤት፣ ክፉ አጥር ይሻላል።",
			subtitle: "A bad fence is better than a bad neighbor.",
			timeLabel: "2m ago",
			statusLabel: "200 OK",
		},
		{
			id: "slowly-egg",
			indexLabel: "፪",
			title: "ቀስ በቀስ፣ እንቁላል በእግሩ ይሄዳል።",
			subtitle: "Step by step, even an egg will walk on its own legs.",
			timeLabel: "2m ago",
			statusLabel: "200 OK",
		},
	] as const;

	let { data }: { data: PageData } = $props();
</script>

<section>
	<h1 class="text-3xl">Welcome, {data.user?.username}!</h1>
</section>

<section class="flex gap-8">
	{#each metrics as metric}
		<DashboardInfoCard class="grow" title={metric.title}>
				<p>{metric.content}</p>
		</DashboardInfoCard>
	{/each}
</section>

<HaragDivider class="my-8" />

<div class="grid grid-cols-12 gap-16">
	<DashboardPanel
		class="col-span-5"
		title="API Credentials"
		meta={`${apiKeys.length} Active Keys`}
	>
		<div class="grid gap-8 border p-8">
			{#each apiKeys as apiKey (apiKey.title)}
				<DashboardApiKeyCard class="grow" title={apiKey.title} value={apiKey.value} />
			{/each}
            <Button><Plus />Generate New Key</Button>
		</div>
		<DashboardInfoCard class="grow" title="Key Security Tip">
			<p>Never expose your API keys in client-side code. Use environment variables.</p>
		</DashboardInfoCard>
	</DashboardPanel>

	<DashboardPanel class="col-span-7" title="Recent Responses" meta="View All History">
		<div class="grid gap-8">
			{#each recentResponses as response (response.id)}
				<RecentResponseCard
					indexLabel={response.indexLabel}
					title={response.title}
					subtitle={response.subtitle}
					timeLabel={response.timeLabel}
					statusLabel={response.statusLabel}
				/>
			{/each}
		</div>
	</DashboardPanel>
</div>
