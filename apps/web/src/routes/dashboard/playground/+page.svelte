<script lang="ts">
	import { Copy, Share2, Sparkles } from "@lucide/svelte";
	import RequestControls from "$lib/components/playground/RequestControls.svelte";
	import ResponsePreview from "$lib/components/playground/ResponsePreview.svelte";

	const endpointOptions = [
		{ value: "random", label: "GET /proverbs/random" },
		{ value: "search", label: "GET /proverbs/search" },
		{ value: "daily", label: "GET /proverbs/daily" },
		{ value: "categories", label: "GET /categories" },
	] as const;

	const apiKeyOptions = [
		{ value: "production", label: "Production" },
		{ value: "staging", label: "Staging" },
		{ value: "internal-tools", label: "Internal Tools" },
	] as const;

	type EndpointValue = (typeof endpointOptions)[number]["value"];
	type ApiKeyValue = (typeof apiKeyOptions)[number]["value"];

    let selectedEndpoint = $state<EndpointValue>("random");
    let selectedApiKey = $state<ApiKeyValue>("production");
    let limit = $state(1);
</script>

<section>
	<h1 class="text-3xl">Playground</h1>
</section>

<aside class="w-full md:w-[380px] flex flex-col border-r border-primary/10 bg-white/40 dark:bg-background-dark/50 p-6 md:p-8 overflow-y-auto relative z-10 shadow-parchment">
<div class="mb-8">
<h2 class="text-2xl font-bold text-ink dark:text-white mb-2 font-display">Send Request</h2>
<p class="text-sm text-ink-light dark:text-gray-400">Configure your parameters to send requests from abbabal-api</p>
</div>
<form class="space-y-6 flex-1">
<RequestControls
    endpointOptions={endpointOptions}
    apiKeyOptions={apiKeyOptions}
    bind:selectedEndpoint
    bind:selectedApiKey
    bind:limit
    endpointLabel="Endpoint"
    apiKeyLabel="API KEY"
    labelClass="grid gap-2 text-sm font-medium text-ink dark:text-white"
    triggerClass="w-full bg-white dark:bg-gray-800"
    limitLayout="inline"
    limitLabel="Limit"
    limitLabelClass="text-sm font-medium text-ink dark:text-white"
    limitValueClass="w-8 h-8 flex items-center justify-center border border-ink/20 rounded bg-white text-sm font-mono dark:bg-gray-800 dark:border-gray-600"
    rangeClass="flex-1 h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
/>

<!-- Action Button -->
<div class="pt-4 mt-auto">
<button class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/30 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden">
<Sparkles class="text-gold size-5" />
<span>Fetch Proverb</span>
</button>
<p class="text-xs text-center mt-3 text-ink-light/60 dark:text-gray-500">Latency: <span class="font-mono text-primary">24ms</span></p>
</div>
</form>
</aside>

<ResponsePreview tabsHeaderClass="flex items-center justify-between">
    {#snippet actions()}
        <div class="flex gap-4">
            <Copy />
            <Share2 />
        </div>
    {/snippet}
    {#snippet visual()}
        <div class="flex-1 relative flex items-center justify-center">
            <!-- Background Decorative Pattern -->
            <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <span class="font-ethiopic text-[400px] text-primary">ሀ</span>
            </div>
            <!-- Visual Card Component -->
            <div class="relative w-full max-w-2xl transform transition-all hover:-translate-y-1 duration-300">
                <!-- Card Body -->
                <div class="bg-[#fcfbf7] dark:bg-[#2a2424] rounded-xl shadow-card p-8 md:p-12 relative overflow-hidden border border-[#e6e2d3] dark:border-[#3a3030]">
                    <!-- Decorative Corners -->
                    <div class="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary/20 rounded-tl-xl m-4"></div>
                    <div class="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary/20 rounded-tr-xl m-4"></div>
                    <div class="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary/20 rounded-bl-xl m-4"></div>
                    <div class="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary/20 rounded-br-xl m-4"></div>
                    <!-- Card Header -->
                    <div class="flex items-center justify-center mb-8 opacity-60">
                        <span class="h-px w-12 bg-primary"></span>
                        <span class="mx-3 text-xs font-bold uppercase tracking-[0.2em] text-primary font-display">Wisdom #1042</span>
                        <span class="h-px w-12 bg-primary"></span>
                    </div>
                    <!-- Main Text -->
                    <div class="text-center relative z-10 space-y-6">
                        <h3 class="text-4xl md:text-5xl lg:text-6xl font-ethiopic leading-tight text-ink dark:text-gray-100 drop-shadow-sm">
                            <span class="text-primary">የ</span>ሚያይ ዓይን አይታጠብም
                        </h3>
                        <p class="text-lg md:text-xl text-ink-light/80 dark:text-gray-400 italic font-display max-w-md mx-auto leading-relaxed border-t border-primary/10 pt-6 mt-6">
                            "The eye that sees does not wash itself."
                        </p>
                    </div>
                    <!-- Footer Tags -->
                    <div class="mt-12 flex justify-center gap-3">
                        <span class="px-3 py-1 bg-parchment-dark/50 dark:bg-white/10 rounded-full text-xs font-bold text-ink/60 dark:text-gray-400 uppercase tracking-wide">Category: Observation</span>
                        <span class="px-3 py-1 bg-parchment-dark/50 dark:bg-white/10 rounded-full text-xs font-bold text-ink/60 dark:text-gray-400 uppercase tracking-wide">Region: Shewa</span>
                    </div>
                </div>
                <!-- Backing Sheets for Stacked Effect -->
                <div class="absolute inset-0 bg-[#f4efe4] dark:bg-[#251e1e] rounded-xl transform rotate-2 -z-10 shadow-sm border border-black/5"></div>
                <div class="absolute inset-0 bg-[#efe8db] dark:bg-[#1f1919] rounded-xl transform -rotate-1 -z-20 shadow-sm border border-black/5"></div>
            </div>
        </div>
    {/snippet}
    {#snippet json()}
        <div class="w-full max-w-3xl h-[500px] bg-background-dark rounded-xl shadow-2xl overflow-hidden border border-white/10 flex flex-col font-mono text-sm">
            <div class="flex items-center justify-between px-4 py-3 bg-[#1a0f0f] border-b border-white/5">
                <div class="flex gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span class="text-xs text-gray-500">response.json</span>
            </div>
            <div class="flex-1 p-6 overflow-auto text-gray-300">
                <pre><code>
  <span class="text-primary">"status"</span>: <span class="text-green-400">"success"</span>,
  <span class="text-primary">"data"</span>: 
    <span class="text-primary">"id"</span>: <span class="text-yellow-400">1042</span>,
    <span class="text-primary">"attributes"</span>: 
      <span class="text-primary">"amharic"</span>: <span class="text-yellow-200">"የሚያይ ዓይን አይታጠብም"</span>,
      <span class="text-primary">"english"</span>: <span class="text-green-200">"The eye that sees does not wash itself."</span>,
      <span class="text-primary">"category"</span>: <span class="text-green-200">"Observation"</span>,
      <span class="text-primary">"tags"</span>: [
        <span class="text-green-200">"body"</span>,
        <span class="text-green-200">"irony"</span>
      ]
  <span class="text-primary">"meta"</span>: 
    <span class="text-primary">"timestamp"</span>: <span class="text-green-400">"2023-10-27T14:30:00Z"</span>
</code></pre>
            </div>
        </div>
    {/snippet}
</ResponsePreview>
