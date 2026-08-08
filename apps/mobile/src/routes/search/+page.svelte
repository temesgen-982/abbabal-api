<script lang="ts">
  import { Search, X, Bookmark } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { api, type Proverb } from '$lib/api';
  import { accentFor } from '$lib/proverb-accent';
  import { getSearchState } from '$lib/stores/search.svelte';
  import { getSavedState } from '$lib/stores/saved.svelte';

  const store = getSearchState();
  const saved = getSavedState();

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

<!-- Search Header -->
<div class="sticky top-0 z-10 bg-background px-4 py-3">
  <div class="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-2.5">
    <Search size={18} class="text-muted-foreground shrink-0" />
    <input
      type="search"
      placeholder="Search Amharic or English..."
      bind:value={store.query}
      oninput={onInput}
      class="search-input flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
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
        {@const accent = accentFor(i)}
        <div
          role="button"
          tabindex="0"
          style="border-left: 4px solid {accent.strong}"
          class="relative bg-card rounded-r-2xl p-4 pl-5 flex gap-3 shadow-sm border border-border active:scale-[0.99] transition-transform text-left w-full"
          onclick={() => goto(`/proverb-detail?id=${proverb.id}`)}
          onkeydown={(e) => e.key === /* @wc-ignore */ 'Enter' && goto(`/proverb-detail?id=${proverb.id}`)}
        >
          <div class="flex-1 min-w-0">
            <p class="text-base font-semibold leading-relaxed text-foreground">{proverb.text}</p>
            {#if translation}
              <p class="text-sm text-muted-foreground italic mt-1">{translation}</p>
            {/if}
          </div>
          <div class="shrink-0 flex items-center">
            <button
              class="flex items-center justify-center p-2 -m-1 text-muted-foreground active:text-primary transition-colors"
              onclick={(e) => { e.stopPropagation(); saved.toggle(proverb); }}
              aria-label={saved.has(proverb.id) ? 'Remove from saved' : 'Save proverb'}
            >
              <Bookmark size={18} class={saved.has(proverb.id) ? 'text-primary fill-primary' : ''} />
            </button>
          </div>
        </div>
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

<style>
  /* Hide the native WebKit clear (x) button — the app renders its own */
  .search-input::-webkit-search-cancel-button,
  .search-input::-webkit-search-decoration {
    -webkit-appearance: none;
    appearance: none;
  }
</style>