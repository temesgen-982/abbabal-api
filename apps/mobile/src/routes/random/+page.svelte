<script lang="ts">
  import { Shuffle, Share2 } from '@lucide/svelte';
  import { api, type Proverb } from '$lib/api';
  import { onMount } from 'svelte';
  import { Share } from '@capacitor/share';

  let proverb = $state<Proverb | null>(null);
  let loading = $state(false);
  let error = $state('');
  let cardScroller = $state<HTMLDivElement>(null!);

  // Start each new proverb at the top of the scrollable card area
  $effect(() => {
    if (proverb) cardScroller?.scrollTo({ top: 0 });
  });

  async function fetchRandom() {
    if (loading) return;
    loading = true;
    error = '';
    try {
      proverb = await api.proverbs.random();
    } catch (e) {
      error = 'Failed to load proverb. Please try again.';
    } finally {
      loading = false;
    }
  }

  function getTranslation(p: Proverb) {
    return p.interpretations.find(
      (i) => i.type === 'translation' && i.language === 'en' && i.isApproved
    )?.content ?? null;
  }

  function getMeaning(p: Proverb) {
    return p.interpretations.find(
      (i) => i.type === 'meaning' && i.language === 'en' && i.isApproved
    )?.content ?? null;
  }

  async function share(p: Proverb) {
    const translation = getTranslation(p);
    const text = translation
      ? `${p.text}\n\n"${translation}"\n\nvia አባባል`
      : `${p.text}\n\nvia አባባል`;

    await Share.share({ text });
  }

  onMount(() => {
    fetchRandom();
  });
</script>

<!--
  The button is position:fixed, pinned just above the bottom nav (nav sits at
  bottom-4 + h-16 = 80px from the viewport bottom; the button rests at 96px).
  Being fixed, no proverb content can ever push it behind the navigation.
  The card scrolls inside its own dvh-bounded area, centered via margin:auto
  (safe for overflow — no unreachable content, unlike justify-center).
-->
<div class="max-w-lg mx-auto w-full px-4 pt-6">

  {#if loading}
    <div class="min-h-[55vh] flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
    </div>

  {:else if error}
    <div class="min-h-[55vh] flex flex-col items-center justify-center gap-4 text-muted-foreground text-center">
      <p>{error}</p>
      <button onclick={fetchRandom} class="px-6 py-2 rounded-full border border-border bg-card text-sm">
        Retry
      </button>
    </div>

  {:else if proverb}
    {@const translation = getTranslation(proverb)}
    {@const meaning = getMeaning(proverb)}

    <!-- Scrollable card area (centered when short, scrolls when long) -->
    <div
      bind:this={cardScroller}
      class="overflow-y-auto overscroll-contain flex flex-col"
      style="max-height: calc(100vh - 16rem); max-height: calc(100dvh - 16rem);"
    >
      <div class="my-auto w-full bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-4">
        <!-- Label -->
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-primary"></div>
          <span class="text-xs font-semibold text-primary uppercase tracking-widest">Proverb</span>
        </div>

        <!-- Amharic text -->
        <p class="font-ethiopic text-2xl font-bold leading-relaxed text-foreground">{proverb.text}</p>

        {#if translation}
          <div class="border-t border-border pt-4">
            <p class="text-sm text-muted-foreground uppercase tracking-wide mb-1">Translation</p>
            <p class="text-base italic text-foreground">{translation}</p>
          </div>
        {/if}

        {#if meaning}
          <div class="border-t border-border pt-4">
            <p class="text-sm text-muted-foreground uppercase tracking-wide mb-1">Meaning</p>
            <p class="text-sm text-muted-foreground leading-relaxed">{meaning}</p>
          </div>
        {/if}

        <!-- Share -->
        <div class="border-t border-border pt-4 flex justify-end">
          <button
            onclick={() => proverb && share(proverb)}
            class="flex items-center gap-2 text-sm text-muted-foreground active:text-primary transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>
    </div>
  {/if}

</div>

<!-- New Proverb — fixed just above the bottom nav, always visible -->
<button
  onclick={fetchRandom}
  disabled={loading}
  class="fixed bottom-24 left-4 right-4 max-w-lg mx-auto z-20 flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
>
  <Shuffle size={18} class={loading ? 'animate-spin' : ''} />
  New Proverb
</button>
