<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, List, Grid, Bookmark, Volume2, Shuffle } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let searchInput = $state(data.searchQuery);
  let showFilters = $state(false);
  let viewMode = $state<'list' | 'grid'>('list');

  const totalPages = $derived(Math.max(1, Math.ceil(data.total / data.limit)));

  function doSearch(e: Event) {
    e.preventDefault();
    const q = searchInput.trim();
    if (q) {
      goto(`/proverbs?search=${encodeURIComponent(q)}`);
    } else {
      goto('/proverbs');
    }
  }

  function goToPage(p: number) {
    if (p < 1 || p > totalPages) return;
    const params = new URLSearchParams($page.url.searchParams);
    params.set('page', String(p));
    goto(`/proverbs?${params.toString()}`);
  }

  function goToRandom() {
    const id = Math.floor(Math.random() * (data.proverbCount ?? 7576)) + 1;
    goto(`/proverbs/${id}`);
  }

  function clearFilters() {
    goto('/proverbs');
  }

  const pageNumbers = $derived.by(() => {
    const pages: (number | '...')[] = [];
    const current = data.page;
    const total = totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  const startResult = $derived((data.page - 1) * data.limit + 1);
  const endResult = $derived(Math.min(data.page * data.limit, data.total));
</script>

<div class="mx-auto max-w-7xl px-6">
  <!-- Header -->
  <div class="py-8">
    <div class="flex items-center gap-3">
      <div class="h-7 w-1 rounded-full bg-primary"></div>
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">Proverbs</h1>
        <p class="mt-0.5 text-sm text-muted-foreground">Explore thousands of Amharic proverbs.</p>
      </div>
    </div>
  </div>

  <!-- Search + Controls Row -->
  <div class="mb-6 grid items-center gap-4 md:grid-cols-[1fr_auto]">
    <form onsubmit={doSearch} class="relative">
      <Search size={16} class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        bind:value={searchInput}
        placeholder="Search proverbs in Amharic or English..."
        class="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none shadow-sm placeholder:text-muted-foreground/60"
      />
    </form>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-sm">
        <label class="text-xs text-muted-foreground">Sort by</label>
        <select class="border-none bg-transparent text-xs font-semibold outline-none">
          <option>Most Recent</option>
          <option>Alphabetical</option>
        </select>
      </div>
      <div class="flex rounded-xl bg-secondary p-1">
        <button onclick={() => viewMode = 'list'} class="rounded-lg p-2 {viewMode === 'list' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}" aria-label="List view">
          <List size={16} />
        </button>
        <button onclick={() => viewMode = 'grid'} class="rounded-lg p-2 {viewMode === 'grid' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}" aria-label="Grid view">
          <Grid size={16} />
        </button>
      </div>
    </div>
  </div>

  <!-- Main Layout -->
  <div class="grid gap-8 pb-16 md:grid-cols-[260px_1fr]">
    <!-- Sidebar Filters -->
    <aside class="hidden md:block">
      <div class="rounded-2xl border border-border bg-secondary p-6">
        <div class="mb-5 flex items-center justify-between">
          <h3 class="text-sm font-bold">Filters</h3>
          <button onclick={clearFilters} class="text-xs font-semibold text-primary">Clear all</button>
        </div>

        <div class="mb-5">
          <label class="mb-2 block text-xs font-semibold">Search in meaning</label>
          <div class="relative">
            <Search size={14} class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="e.g. patience, work..." class="w-full rounded-lg border border-border bg-card py-2 pl-8 pr-3 text-xs outline-none" />
          </div>
        </div>

        <div class="mb-5">
          <label class="mb-2 block text-xs font-semibold">Language</label>
          <div class="flex flex-col gap-3">
            {#each ['Amharic', 'English', 'Transliteration'] as lang}
              <label class="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={lang === 'Amharic' || lang === 'English'} class="accent-primary h-4 w-4" />
                {lang}
              </label>
            {/each}
          </div>
        </div>

        <div class="mb-5">
          <label class="mb-2 block text-xs font-semibold">Length</label>
          <select class="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none">
            <option>Any length</option>
            <option>Short (&lt; 5 words)</option>
            <option>Medium (5-10 words)</option>
            <option>Long (&gt; 10 words)</option>
          </select>
        </div>

        <div class="mb-5">
          <label class="mb-2 block text-xs font-semibold">Added</label>
          <select class="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs outline-none">
            <option>Anytime</option>
            <option>Past Week</option>
            <option>Past Month</option>
            <option>Past Year</option>
          </select>
        </div>

        <button class="w-full rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          Apply Filters
        </button>
      </div>
    </aside>

    <!-- Content -->
    <div>
      <!-- Results count + mobile filters -->
      <div class="mb-4 flex items-center justify-between">
        <p class="text-xs text-muted-foreground">
          Showing {startResult}–{endResult} of <strong class="text-foreground">{data.total.toLocaleString()}</strong> proverbs
        </p>
        <button onclick={() => showFilters = !showFilters} class="flex items-center gap-1.5 text-xs font-semibold text-primary md:hidden">
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      <!-- Proverbs List / Grid -->
      {#if data.proverbs.length === 0}
        <div class="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-20">
          <p class="text-sm font-semibold">No proverbs found</p>
          <p class="mt-1 text-xs text-muted-foreground">Try adjusting your search or filters.</p>
          <button onclick={clearFilters} class="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">Clear filters</button>
        </div>
      {:else if viewMode === 'list'}
        <div class="flex flex-col gap-4">
          {#each data.proverbs as proverb, i}
            <a href="/proverbs/{proverb.id}" class="block rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div class="grid items-start gap-4 md:grid-cols-[auto_1fr_auto]">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                  {(data.page - 1) * data.limit + i + 1}
                </div>
                <div>
                  <p class="font-ethiopic text-lg font-bold leading-relaxed">{proverb.text}</p>
                  {#if proverb.source}
                    <span class="mt-2 inline-block rounded-full bg-muted px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {proverb.source}
                    </span>
                  {/if}
                </div>
                <div class="hidden items-start gap-2 md:flex">
                  <button onclick={(e) => { e.preventDefault(); }} class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-white hover:border-primary" aria-label="Bookmark">
                    <Bookmark size={14} />
                  </button>
                  <button onclick={(e) => { e.preventDefault(); }} class="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-white hover:border-primary" aria-label="Listen">
                    <Volume2 size={14} />
                  </button>
                </div>
              </div>
            </a>
          {/each}
        </div>
      {:else}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each data.proverbs as proverb}
            <a href="/proverbs/{proverb.id}" class="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
              <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-[10px] font-bold text-muted-foreground mb-3">
                #{proverb.id}
              </div>
              <p class="font-ethiopic text-sm font-bold leading-relaxed">{proverb.text}</p>
              {#if proverb.source}
                <span class="mt-3 inline-block self-start rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {proverb.source}
                </span>
              {/if}
            </a>
          {/each}
        </div>
      {/if}

      <!-- Pagination -->
      {#if data.total > data.limit}
        <div class="mt-8 flex items-center justify-center gap-2">
          <button
            onclick={() => goToPage(data.page - 1)}
            disabled={data.page <= 1}
            class="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          {#each pageNumbers as p}
            {#if p === '...'}
              <span class="px-1 text-xs text-muted-foreground">...</span>
            {:else}
              <button
                onclick={() => goToPage(p)}
                class="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition-colors {p === data.page ? 'bg-primary text-primary-foreground' : 'border border-border bg-card hover:border-primary hover:text-primary'}"
              >
                {p}
              </button>
            {/if}
          {/each}

          <button
            onclick={() => goToPage(data.page + 1)}
            disabled={data.page >= totalPages}
            class="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
