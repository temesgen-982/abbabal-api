<script lang="ts">
	import { Copy, Share2, Sparkles } from "@lucide/svelte";
	import { PUBLIC_API_BASE_URL } from "$env/static/public";
	import PlaygroundRequestPanel from "$lib/components/playground/PlaygroundRequestPanel.svelte";
	import ResponsePreview from "$lib/components/playground/ResponsePreview.svelte";
	import {
		runPlaygroundRequest,
		normalizePlaygroundRequest,
		type PlaygroundEndpoint,
	} from "$lib/playground/api";
	import { Button } from "$lib/components/ui/button";

	const endpointOptions = [
		{ value: "random", label: "GET /proverbs/random" },
		{ value: "search", label: "GET /proverbs/search" },
		{ value: "list", label: "GET /proverbs" },
		{ value: "by-id", label: "GET /proverbs/{id}" },
	] as const;

	const apiKeyOptions = [
		{ value: "production", label: "Production" },
		{ value: "staging", label: "Staging" },
		{ value: "internal-tools", label: "Internal Tools" },
	] as const;

	type EndpointValue = (typeof endpointOptions)[number]["value"];
	type ApiKeyValue = (typeof apiKeyOptions)[number]["value"];

	let selectedEndpoint = $state<EndpointValue>(endpointOptions[0].value);
	let selectedApiKey = $state<ApiKeyValue>(apiKeyOptions[0].value);
	let limit = $state(1);
	let page = $state(1);
	let searchQuery = $state("wisdom");
	let proverbId = $state("1");
	let apiKey = $state("");
	let response = $state<unknown | null>(null);
	let lastStatus = $state<number | null>(null);
	let lastLatency = $state<number | null>(null);
	let errorMessage = $state<string | null>(null);
	let isLoading = $state(false);
	const API_BASE_URL = (PUBLIC_API_BASE_URL || "http://localhost:3000").replace(
		/\/$/,
		"",
	);

	const latencyLabel = $derived(`${18 + limit * 3}ms`);
	const showQuery = $derived(selectedEndpoint === "search");
	const showId = $derived(selectedEndpoint === "by-id");
	const showPage = $derived(selectedEndpoint === "list");

	const responseJson = $derived.by(() => {
		if (errorMessage) {
			return JSON.stringify(
				{ status: "error", message: errorMessage, code: lastStatus },
				null,
				2,
			);
		}

		if (!response) {
			return JSON.stringify({ status: "idle", message: "No response yet." }, null, 2);
		}

		return JSON.stringify(response, null, 2);
	});

	const visualProverb = $derived.by(() => {
		if (!response || typeof response !== "object") {
			return null;
		}

		const data = response as Record<string, unknown>;
		if (Array.isArray(data)) {
			return data[0] as Record<string, unknown> | undefined;
		}

		if (Array.isArray(data.results)) {
			return data.results[0] as Record<string, unknown> | undefined;
		}

		return data as Record<string, unknown>;
	});

	const visualText = $derived.by(() => {
		if (!visualProverb) {
			return "Run a request to preview a proverb.";
		}

		return (
			(visualProverb.text as string | undefined) ||
			(visualProverb.english as string | undefined) ||
			"No text available."
		);
	});

	const visualSubtitle = $derived.by(() => {
		if (!visualProverb) {
			return "Waiting for the API response.";
		}

		return "Preview of the latest response data.";
	});

	async function runRequest(event?: Event) {
		event?.preventDefault();

		if (selectedEndpoint === "search" && !searchQuery.trim()) {
			errorMessage = "Search requires a query.";
			response = null;
			return;
		}

		if (selectedEndpoint === "by-id" && !proverbId.trim()) {
			errorMessage = "Provide a proverb ID to fetch.";
			response = null;
			return;
		}

		isLoading = true;
		errorMessage = null;

		try {
			const payload = normalizePlaygroundRequest({
				endpoint: selectedEndpoint as PlaygroundEndpoint,
				limit,
				page,
				query: searchQuery,
				id: proverbId,
				apiKey,
			});

			const result = await runPlaygroundRequest(fetch, API_BASE_URL, payload);
			lastStatus = result.status;
			lastLatency = result.latency;
			response = result.data;
			errorMessage = result.error ?? null;
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : "Network request failed.";
			response = null;
		} finally {
			isLoading = false;
		}
	}

	async function copyResponse() {
		await navigator.clipboard.writeText(responseJson);
	}

	async function shareResponse() {
		if (navigator.share) {
			await navigator.share({
				title: "Abbabal API Response",
				text: responseJson,
			});
			return;
		}

		await copyResponse();
	}
</script>


<div class="mx-auto max-w-7xl px-4 py-16 text-foreground">
	<section class="mb-16 flex flex-col items-center gap-12 text-center lg:flex-row lg:text-left">
		<div class="max-w-xl flex-1">
			<h1 class="font-serif text-5xl font-bold tracking-tight md:text-7xl">Playground</h1>
			<div class="my-5 flex items-center justify-center gap-2 lg:justify-start">
				<span class="h-px w-8 bg-primary"></span>
				<span class="text-xs text-primary">*</span>
				<span class="h-px w-8 bg-primary"></span>
			</div>
			<p class="text-muted-foreground mb-4 font-serif text-2xl italic">
				Design, send, and preview Abbabal requests.
			</p>
			<p class="text-muted-foreground leading-7">
				Tune parameters, inspect responses, and share sample payloads in a
				focused workspace. Everything here mirrors the production API.
			</p>
			<div class="mt-8 flex flex-wrap gap-3">
				<Button size="lg" onclick={() => runRequest()} disabled={isLoading}>
					<Sparkles size={16} />
					Run a sample request
				</Button>
				<Button variant="outline" size="lg">View docs</Button>
			</div>
		</div>
		<div class="flex flex-1 justify-center"></div>
	</section>

	<section class="grid gap-8 lg:grid-cols-[360px_1fr]">
			<PlaygroundRequestPanel
				endpointOptions={endpointOptions}
				apiKeyOptions={apiKeyOptions}
				bind:selectedEndpoint
				bind:selectedApiKey
				bind:limit
				bind:apiKey
				bind:query={searchQuery}
				bind:id={proverbId}
				bind:page
				showQuery={showQuery}
				showId={showId}
				showPage={showPage}
				latencyLabel={latencyLabel}
				isLoading={isLoading}
				onSubmit={runRequest}
			/>

			<ResponsePreview
				class="bg-card/80 text-card-foreground rounded-3xl border border-border p-6 shadow-sm backdrop-blur"
				actionsPlacement="header"
				listClass="bg-muted/60 flex w-fit items-center gap-2 rounded-full p-1"
				tabsHeaderClass="flex items-center justify-start"
			>
				{#snippet header()}
					<div>
						<p class="text-muted-foreground text-xs uppercase tracking-[0.3em]">
							Response preview
						</p>
						<h2 class="text-2xl font-semibold">Inspect the output</h2>
					</div>
				{/snippet}
				{#snippet actions()}
					<Button variant="ghost" size="icon-sm" aria-label="Copy response" onclick={copyResponse}>
						<Copy />
					</Button>
					<Button variant="ghost" size="icon-sm" aria-label="Share response" onclick={shareResponse}>
						<Share2 />
					</Button>
				{/snippet}
				{#snippet visual()}
					<div class="rounded-3xl border border-border bg-background/80 p-8 shadow-sm">
						<div class="grid gap-6">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3">
									<span class="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
										{lastStatus ? `Status ${lastStatus}` : "Waiting"}
									</span>
								</div>
								<span class="text-muted-foreground text-xs">
									{lastLatency ? `${lastLatency}ms` : "Latency pending"}
								</span>
							</div>

							<div class="space-y-4 text-center">
								<h3 class="font-display text-3xl md:text-4xl">
									{visualText}
								</h3>
								<p class="text-muted-foreground text-base">
									{visualSubtitle}
								</p>
							</div>

							<div class="flex flex-wrap items-center justify-center gap-3">
								<span class="bg-secondary/20 text-secondary inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
									Endpoint: {selectedEndpoint}
								</span>
								<span class="bg-muted text-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
									Environment: {selectedApiKey}
								</span>
							</div>
						</div>
					</div>
				{/snippet}
				{#snippet json()}
					<div class="rounded-3xl border border-border bg-background/90 p-6 font-mono text-sm shadow-sm">
						<pre class="text-muted-foreground leading-6">{responseJson}</pre>
					</div>
				{/snippet}
			</ResponsePreview>
		</section>
	</div>
