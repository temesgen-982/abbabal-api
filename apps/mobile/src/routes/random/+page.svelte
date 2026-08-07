<script lang="ts">
  import { Shuffle, Share2 } from '@lucide/svelte';
  import { api, type Proverb } from '$lib/api';
  import { onMount } from 'svelte';
  import { Share } from '@capacitor/share';

  let proverb = $state<Proverb | null>(null);
  let loading = $state(false);
  let error = $state('');

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

<div class="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6 min-h-[70vh] justify-center">

  {#if loading}
    <div class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
    </div>

  {:else if error}
    <div class="text-center py-16 text-muted-foreground">
      <p>{error}</p>
      <button onclick={fetchRandom} class="mt-4 px-6 py-2 rounded-full border border-border bg-card text-sm">
        Retry
      </button>
    </div>

  {:else if proverb}
    {@const translation = getTranslation(proverb)}
    {@const meaning = getMeaning(proverb)}

    <!-- Proverb card -->
    <div class="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-4">
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

    <!-- New proverb button -->
    <button
      onclick={fetchRandom}
      class="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-sm active:scale-95 transition-transform"
    >
      <Shuffle size={18} />
      New Proverb
    </button>
  {/if}

</div>