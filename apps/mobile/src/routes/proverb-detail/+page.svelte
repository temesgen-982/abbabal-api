<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { Share } from '@capacitor/share';
  import { api, type Proverb } from '$lib/api';

  let proverb = $state<Proverb | null>(null);
  let loading = $state(true);
  let error = $state('');

  const id = $derived(Number(page.url.searchParams.get('id')));

  function getInterpretations(type: string, language: string) {
    return proverb?.interpretations.filter(
      (i) => i.type === type && i.language === language && i.isApproved
    ) ?? [];
  }

  async function shareProverb() {
    if (!proverb) return;
    const translation = getInterpretations('translation', 'en')[0]?.content;
    const text = translation
      ? `${proverb.text}\n\n"${translation}"\n\nvia አባባል`
      : `${proverb.text}\n\nvia አባባል`;
    await Share.share({ text });
  }

  $effect(() => {
    if (!id) return;
    loading = true;
    api.proverbs.findOne(id)
      .then((data) => { proverb = data; })
      .catch(() => { error = 'Failed to load proverb.'; })
      .finally(() => { loading = false; });
  });
</script>

<div class="max-w-lg mx-auto w-full px-4 py-6 flex flex-col gap-4 overflow-y-auto pb-24">

  {#if loading}
    <div class="flex justify-center py-20">
      <div class="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
    </div>

  {:else if error}
    <div class="text-center py-16 text-muted-foreground">
      <p>{error}</p>
      <button onclick={() => goto('/')} class="mt-4 px-6 py-2 rounded-full border border-border bg-card text-sm">
        Go back
      </button>
    </div>

  {:else if proverb}
    <div class="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-primary"></div>
        <span class="text-xs font-semibold text-primary uppercase tracking-widest">Amharic</span>
      </div>
      <p class="text-2xl font-bold leading-relaxed">{proverb.text}</p>
    </div>

    {#each getInterpretations('translation', 'en') as interp}
      <div class="bg-card rounded-2xl p-5 border border-border flex flex-col gap-1">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Translation</p>
        <p class="text-base italic text-foreground">{interp.content}</p>
      </div>
    {/each}

    {#each getInterpretations('meaning', 'en') as interp}
      <div class="bg-card rounded-2xl p-5 border border-border flex flex-col gap-1">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Meaning</p>
        <p class="text-sm text-muted-foreground leading-relaxed">{interp.content}</p>
      </div>
    {/each}

    {#each getInterpretations('meaning', 'am') as interp}
      <div class="bg-card rounded-2xl p-5 border border-border flex flex-col gap-1">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ትርጉም</p>
        <p class="text-sm text-muted-foreground leading-relaxed">{interp.content}</p>
      </div>
    {/each}

    <div class="text-center text-xs text-muted-foreground pt-2">
      {new Date(proverb.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  {/if}
</div>