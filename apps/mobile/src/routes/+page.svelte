<script lang="ts">
  import { onMount } from 'svelte';
  import { api, type Proverb } from '$lib/api';
  import { Bookmark } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { getSavedState } from '$lib/stores/saved.svelte';

  const saved = getSavedState();

  let proverbs = $state<Proverb[]>([]);
  let page = $state(1);
  let total = $state(0);
  let loading = $state(false);
  let initialLoading = $state(true);
  let error = $state('');
  let showBackToTop = $state(false);
  let sentinel = $state<HTMLDivElement>(null!);
  const LIMIT = 40;

  const hasMore = $derived(proverbs.length < total);

  async function loadMore() {
    if (loading) return;
    loading = true;
    error = '';
    try {
      const data = await api.proverbs.list(page, LIMIT);
      total = data.total;
      proverbs = [...proverbs, ...data.results];
      page += 1;
    } catch (e) {
      error = 'Failed to load proverbs. Please try again.';
    } finally {
      loading = false;
      initialLoading = false;
    }
  }

  function getTranslation(proverb: Proverb) {
    return proverb.interpretations.find(
      (i) => i.type === 'translation' && i.language === 'en' && i.isApproved
    )?.content ?? null;
  }

  function getMeaning(proverb: Proverb) {
    return proverb.interpretations.find(
      (i) => i.type === 'meaning' && i.language === 'en' && i.isApproved
    )?.content ?? null;
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  $effect(() => {
    function onScroll() {
      showBackToTop = window.scrollY > 400;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  let observer: IntersectionObserver | null = null;

  $effect(() => {
    if (!sentinel) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinel);
    return () => observer?.disconnect();
  });

  onMount(() => {
    loadMore();
  });
</script>


<!-- Feed -->
<div class="max-w-lg mx-auto px-4 py-4 pb-24">

  {#if initialLoading}
    <div class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-3 border-border border-t-primary rounded-full animate-spin"></div>
    </div>

  {:else if error && proverbs.length === 0}
    <div class="text-center py-16 text-muted-foreground">
      <p>{error}</p>
      <button onclick={loadMore} class="mt-4 px-6 py-2 rounded-full border border-border bg-card text-sm">
        Retry
      </button>
    </div>

  {:else}
    <div class="flex flex-col gap-3">
      {#each proverbs as proverb, i (proverb.id)}
        {@const translation = getTranslation(proverb)}
        {@const meaning = getMeaning(proverb)}
        {@const colors = ['bg-primary', 'bg-amber-700', 'bg-emerald-700', 'bg-stone-500']}
        {@const color = colors[i % colors.length]}
        <div
          role="button"
          tabindex="0"
          class="relative bg-card rounded-2xl p-4 flex gap-3 shadow-sm border border-border active:scale-[0.99] transition-transform text-left w-full"
          onclick={() => goto(`/proverb-detail?id=${proverb.id}`)}
          onkeydown={(e) => e.key === /* @wc-ignore */ 'Enter' && goto(`/proverb-detail?id=${proverb.id}`)}
        >
          <!-- Bookmark icon -->
          <div class="shrink-0 mt-1">
            <div class="{color} w-6 h-8 rounded-sm flex items-end justify-center pb-1">
              <div class="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white/40"></div>
            </div>
          </div>
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-base font-semibold leading-relaxed text-foreground">{proverb.text}</p>
            {#if translation}
              <p class="text-sm text-muted-foreground italic mt-1">{translation}</p>
            {/if}
            {#if meaning}
              <p class="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">{meaning}</p>
            {/if}
          </div>
          <!-- Save toggle -->
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

    {#if error}
      <p class="text-center text-red-500 text-sm mt-4">
        {error}
        <button onclick={loadMore} class="underline ml-1">Retry</button>
      </p>
    {/if}
  {/if}

  <!-- Sentinel -->
  <div bind:this={sentinel} class="flex flex-col items-center gap-2 justify-center py-8 min-h-[60px]">
    {#if loading && !initialLoading}
      <div class="w-6 h-6 border-2 border-border border-t-primary rounded-full animate-spin"></div>
    {/if}
    {#if proverbs.length > 0}
      <p class="text-xs text-muted-foreground">
        Loaded {proverbs.length} of {total} proverbs
      </p>
    {/if}
    {#if !hasMore && proverbs.length > 0}
      <p class="text-xs text-muted-foreground">You've seen all {total} proverbs 🎉</p>
    {/if}
  </div>
</div>

<!-- Back to top -->
{#if showBackToTop}
  <button
    onclick={scrollToTop}
    class="fixed bottom-6 right-4 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center text-lg active:scale-95 transition-transform z-20"
    aria-label="Back to top"
  >
    ↑
  </button>
{/if}