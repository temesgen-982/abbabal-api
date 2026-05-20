<script lang="ts">
  import { onMount } from 'svelte';
  import { api, type Proverb } from '$lib/api';

  let proverbs = $state<Proverb[]>([]);
  let page = $state(1);
  let total = $state(0);
  let loading = $state(false);
  let initialLoading = $state(true);
  let error = $state('');
  const LIMIT = 20;

  const hasMore = $derived(proverbs.length < total);

  let sentinel = $state<HTMLDivElement>(null!);

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

  $effect(() => {
    if (!sentinel) return;

    loadMore();

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  });

  let showBackToTop = $state(false);

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
</script>

<div class="feed">
  <header>
    <h1>አባባል</h1>
    <p class="subtitle">Amharic Proverbs</p>
  </header>

  {#if initialLoading}
    <div class="loading-initial">
      <div class="spinner"></div>
    </div>
  {:else if error && proverbs.length === 0}
    <div class="error-state">
      <p>{error}</p>
      <button onclick={loadMore}>Retry</button>
    </div>
  {:else}
    <ul class="proverb-list">
      {#each proverbs as proverb (proverb.id)}
        {@const translation = getTranslation(proverb)}
        {@const meaning = getMeaning(proverb)}
        <li class="proverb-card">
          <p class="proverb-text">{proverb.text}</p>
          {#if translation}
            <p class="translation">{translation}</p>
          {/if}
          {#if meaning}
            <p class="meaning">{meaning}</p>
          {/if}
        </li>
      {/each}
    </ul>

    {#if error}
      <p class="error-inline">{error} <button onclick={loadMore}>Retry</button></p>
    {/if}
  {/if}
</div>

<!-- sentinel element — when this is visible, load more -->
<div bind:this={sentinel} class="sentinel">
  {#if loading && !initialLoading}
    <div class="spinner"></div>
  {/if}
  {#if !hasMore && proverbs.length > 0}
    <p class="end-message">You've seen all {total} proverbs 🎉</p>
  {/if}
  <!-- back to top button -->
  {#if showBackToTop}
    <button class="back-to-top" onclick={scrollToTop} aria-label="Back to top">
      ↑
    </button>
  {/if}
</div>

<style>
  .feed {
    max-width: 600px;
    margin: 0 auto;
    padding: 1rem;
    font-family: system-ui, sans-serif;
  }

  header {
    text-align: center;
    padding: 2rem 0 1.5rem;
    border-bottom: 1px solid #eee;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
  }

  .subtitle {
    color: #888;
    margin: 0.25rem 0 0;
    font-size: 0.9rem;
  }

  .proverb-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .proverb-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }

  .proverb-text {
    font-size: 1.15rem;
    font-weight: 600;
    line-height: 1.6;
    margin: 0;
  }

  .translation {
    font-size: 0.95rem;
    color: #444;
    margin: 0;
    font-style: italic;
  }

  .meaning {
    font-size: 0.85rem;
    color: #777;
    margin: 0;
    border-top: 1px solid #f0f0f0;
    padding-top: 0.5rem;
  }

  .sentinel {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    min-height: 60px;
  }

  .loading-initial {
    display: flex;
    justify-content: center;
    padding: 4rem;
  }

  .spinner {
    width: 28px;
    height: 28px;
    border: 3px solid #eee;
    border-top-color: #333;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-state {
    text-align: center;
    padding: 3rem 1rem;
    color: #666;
  }

  .error-state button {
    margin-top: 1rem;
    padding: 0.6rem 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
  }

  .error-inline {
    text-align: center;
    color: #e00;
    font-size: 0.85rem;
  }

  .error-inline button {
    margin-left: 0.5rem;
    padding: 0.25rem 0.75rem;
    border: 1px solid #e00;
    border-radius: 6px;
    background: #fff;
    color: #e00;
    cursor: pointer;
  }

  .end-message {
    text-align: center;
    color: #aaa;
    font-size: 0.85rem;
  }

  .back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 1.5rem;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #1a1a1a;
    color: #fff;
    font-size: 1.2rem;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s, transform 0.2s;
    z-index: 100;
  }

  .back-to-top:active {
    transform: scale(0.92);
  }
</style>