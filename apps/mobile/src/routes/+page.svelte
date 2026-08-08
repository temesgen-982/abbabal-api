<script lang="ts">
  import { onMount } from 'svelte';
  import { api, type Proverb } from '$lib/api';
  import { Bookmark, ArrowRight } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import { accentFor } from '$lib/proverb-accent';
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

  function openProverb(id: number) {
    goto(`/proverb-detail?id=${id}`);
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
    <div class="flex flex-col gap-4">
      {#each proverbs as proverb, i (proverb.id)}
        {@const translation = getTranslation(proverb)}
        {@const meaning = getMeaning(proverb)}
        {@const accent = accentFor(i)}
        <div
          role="button"
          tabindex="0"
          style="--acc: {accent.strong}; --acc-tint: {accent.tint}; border-left: 4px solid {accent.strong};"
          class="proverb-card relative bg-card rounded-r-2xl p-7 pl-6 pt-6 pb-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] active:scale-[0.99] transition-transform text-left w-full cursor-pointer"
          onclick={() => openProverb(proverb.id)}
          onkeydown={(e) => e.key === /* @wc-ignore */ 'Enter' && openProverb(proverb.id)}
        >
          <!-- Header: meta + bookmark -->
          <div class="flex items-center justify-between mb-5">
            <div class="meta-info">
              <span class="meta-number">{String(proverb.id).padStart(4, '0')}</span>
              <span class="meta-sep">•</span>
              <span class="meta-label">Proverb</span>
            </div>
            <button
              class="flex items-center justify-center p-2 -m-1 text-foreground/60 active:text-primary transition-colors"
              onclick={(e) => { e.stopPropagation(); saved.toggle(proverb); }}
              aria-label={saved.has(proverb.id) ? 'Remove from saved' : 'Save proverb'}
            >
              <Bookmark size={18} class={saved.has(proverb.id) ? 'text-primary fill-primary' : ''} />
            </button>
          </div>

          <!-- Amharic title -->
          <p class="font-ethiopic text-[1.8rem] font-bold leading-snug text-foreground">{proverb.text}</p>

          <div class="accent-bar"></div>

          <!-- Translation quote -->
          {#if translation}
            <div class="quote-block">
              <span class="quote-icon">“</span>
              <p class="quote-text">{translation}</p>
            </div>
          {/if}

          <!-- Meaning -->
          {#if meaning}
            <p class="section-title">Meaning</p>
            <p class="meaning-text line-clamp-3">{meaning}</p>
          {/if}

          <!-- Footer -->
          <div class="card-footer">
            <span class="read-more">
              Read more
              <ArrowRight size={15} />
            </span>
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

<style>
  /* Editorial proverb card — accent colors come from the shared
     PROVERB_ACCENTS palette via --acc / --acc-tint on each card */
  .meta-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .meta-number { color: var(--acc); }
  .meta-sep { color: #b0b0b0; }
  .meta-label { color: var(--muted-foreground); }

  .accent-bar {
    width: 32px;
    height: 3px;
    border-radius: 2px;
    margin: 16px 0 20px;
    background: var(--acc);
  }

  .quote-block {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 18px;
  }
  .quote-icon {
    font-family: Georgia, serif;
    font-size: 2.6rem;
    line-height: 0.8;
    color: var(--acc-tint);
  }
  .quote-text {
    font-style: italic;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--muted-foreground);
  }

  .section-title {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
    color: var(--acc);
  }

  .meaning-text {
    font-size: 0.9rem;
    line-height: 1.5;
    color: var(--muted-foreground);
  }

  .card-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 18px;
  }
  .read-more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--acc);
  }
</style>
