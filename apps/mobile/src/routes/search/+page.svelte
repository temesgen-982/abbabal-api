<script lang="ts">
  import { Search, X } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { api, type Proverb } from '$lib/api';
  import { getSearchState } from '$lib/stores/search.svelte';

  const store = getSearchState();

  let loading = $state(false);
  let error = $state('');

  let debounceTimer: ReturnType<typeof setTimeout>;

  function getTranslation(proverb: Proverb) {
    return proverb.interpretations.find(
      (i) => i.type === 'translation' && i.language === 'en' && i.isApproved
    )?.content ?? null;
  }

  async function doSearch(q: string) {
    if (!q.trim()) {
      store.results = [];
      store.searched = false;
      return;
    }
    loading = true;
    error = '';
    try {
      store.results = await api.proverbs.search(q.trim(), 30);
      store.searched = true;
    } catch (e) {
      error = 'Search failed. Please try again.';
    } finally {
      loading = false;
    }
  }

  function onInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => doSearch(store.query), 400);
  }

  function clear() {
    store.query = '';
    store.results = [];
    store.searched = false;
  }
</script>

<!-- Header -->
<div class="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
  <h1 class="text-lg font-bold mb-3">Search</h1>
  <div class="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-2.5">
    <Search size={18} class="text-muted-foreground shrink-0" />
    <input
      type="search"
      placeholder="Search Amharic or English..."
      bind:value={store.query}
      oninput={onInput}
      class="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
    />
    {#if store.query}
      <button onclick={clear} class="text-muted-foreground">
        <X size={16} />
      </button>
    {/if}
  </div>
</div>

<div class="max-w-lg mx-auto px-4 py-4 pb-24">

  {#if loading}
    <div class="flex justify-center py-16">
      <div class="w-7 h-7 border-2 border-border border-t-primary rounded-full animate-spin"></div>
    </div>

  {:else if error}
    <div class="text-center py-16 text-muted-foreground text-sm">
      <p>{error}</p>
    </div>

  {:else if store.searched && store.results.length === 0}
    <div class="text-center py-16 text-muted-foreground">
      <p class="text-lg mb-1">No results</p>
      <p class="text-sm">Try searching in Amharic or English</p>
    </div>

  {:else if store.results.length > 0}
    <p class="text-xs text-muted-foreground mb-3">{store.results.length} results</p>
    <div class="flex flex-col gap-3">
      {#each store.results as proverb, i (proverb.id)}
        {@const translation = getTranslation(proverb)}
        {@const colors = ['bg-primary', 'bg-amber-700', 'bg-emerald-700', 'bg-stone-500']}
        {@const color = colors[i % colors.length]}
        <button
          class="bg-card rounded-2xl p-4 flex gap-3 shadow-sm border border-border active:scale-[0.99] transition-transform text-left w-full"
          onclick={() => goto(`/proverb-detail?id=${proverb.id}`)}
        >
          <div class="shrink-0 mt-1">
            <div class="{color} w-6 h-8 rounded-sm flex items-end justify-center pb-1">
              <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/40"></div>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-base font-semibold leading-relaxed text-foreground">{proverb.text}</p>
            {#if translation}
              <p class="text-sm text-muted-foreground italic mt-1">{translation}</p>
            {/if}
          </div>
          <div class="shrink-0 flex items-center text-muted-foreground">›</div>
        </button>
      {/each}
    </div>

  {:else}
    <div class="flex flex-col gap-2 items-center py-16 text-muted-foreground">
      <Search />
      <p class="text-base font-medium mb-1">Search proverbs</p>
      <p class="text-sm">Search in Amharic or English</p>
    </div>
  {/if}

</div>