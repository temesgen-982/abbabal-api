<script lang="ts">
  import { Bookmark } from '@lucide/svelte';
  import { goto } from '$app/navigation';
  import type { Proverb } from '$lib/api';
  import { getSavedState } from '$lib/stores/saved.svelte';

  const saved = getSavedState();

  function getTranslation(proverb: Proverb) {
    return proverb.interpretations.find(
      (i) => i.type === 'translation' && i.language === 'en' && i.isApproved
    )?.content ?? null;
  }
</script>

<div class="max-w-lg mx-auto px-4 py-4 pb-24">

  {#if saved.items.length === 0}
    <div class="flex flex-col items-center gap-3 py-20 text-muted-foreground">
      <Bookmark size={40} />
      <p class="text-lg font-medium text-foreground">No saved proverbs</p>
      <p class="text-sm">Tap the bookmark on a proverb to save it here for offline reading.</p>
      <button
        onclick={() => goto('/')}
        class="mt-2 px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold active:scale-95 transition-transform"
      >
        Explore proverbs
      </button>
    </div>

  {:else}
    <p class="text-xs text-muted-foreground mb-3">{saved.items.length} saved</p>
    <div class="flex flex-col gap-3">
      {#each saved.items as proverb, i (proverb.id)}
        {@const translation = getTranslation(proverb)}
        {@const colors = ['bg-primary', 'bg-amber-700', 'bg-emerald-700', 'bg-stone-500']}
        {@const color = colors[i % colors.length]}
        <div
          role="button"
          tabindex="0"
          class="relative bg-card rounded-2xl p-4 flex gap-3 shadow-sm border border-border active:scale-[0.99] transition-transform text-left w-full"
          onclick={() => goto(`/proverb-detail?id=${proverb.id}`)}
          onkeydown={(e) => e.key === /* @wc-ignore */ 'Enter' && goto(`/proverb-detail?id=${proverb.id}`)}
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
          <div class="shrink-0 flex items-center">
            <button
              class="flex items-center justify-center p-2 -m-1 text-primary transition-colors"
              onclick={(e) => { e.stopPropagation(); saved.remove(proverb.id); }}
              aria-label="Remove from saved"
            >
              <Bookmark size={18} class="fill-primary" />
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}

</div>
