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

  onMount(() => {
    loadMore();
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

    {#if hasMore}
      <button class="load-more" onclick={loadMore} disabled={loading}>
        {loading ? 'Loading...' : 'Load more'}
      </button>
    {/if}

    {#if error}
      <p class="error-inline">{error}</p>
    {/if}
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

  .load-more {
    display: block;
    width: 100%;
    margin: 1.5rem 0;
    padding: 0.85rem;
    border: 1px solid #ddd;
    border-radius: 10px;
    background: #fff;
    font-size: 0.95rem;
    cursor: pointer;
    color: #333;
  }

  .load-more:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-initial {
    display: flex;
    justify-content: center;
    padding: 4rem;
  }

  .spinner {
    width: 32px;
    height: 32px;
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
</style>