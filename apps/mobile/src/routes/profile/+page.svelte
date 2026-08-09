<script lang="ts">
  import { Bookmark, RefreshCw, Share2, Trash2 } from '@lucide/svelte';
  import { App } from '@capacitor/app';
  import { Share } from '@capacitor/share';
  import { getSavedState } from '$lib/stores/saved.svelte';
  import { BASE_URL } from '$lib/api';
  import { getLastSyncAt, syncDatabase } from '$lib/db';

  const saved = getSavedState();

  let appVersion = $state('0.0.1');
  let syncing = $state(false);
  let syncError = $state('');
  let syncOk = $state(false);

  $effect(() => {
    App.getInfo()
      .then((info) => { appVersion = info.version; })
      .catch(() => {});
  });

  const lastSyncLabel = $derived.by(() => {
    const raw = getLastSyncAt();
    if (!raw) return null;
    return new Date(raw).toLocaleString();
  });

  async function syncNow() {
    if (syncing) return;
    syncing = true;
    syncError = '';
    syncOk = false;
    try {
      const ok = await syncDatabase(BASE_URL);
      syncOk = ok;
      if (!ok) syncError = 'Sync failed. Check your connection.';
    } catch (e) {
      syncError = 'Sync failed. Check your connection.';
    } finally {
      syncing = false;
    }
  }

  function removeAll() {
    if (saved.items.length > 0 && confirm('Remove all saved proverbs?')) {
      saved.clear();
    }
  }

  async function shareApp() {
    await Share.share({
      title: 'አባባል',
      text: 'አባባል — Amharic Proverbs. Preserve wisdom. Share culture.',
      dialogTitle: 'Share Abbabal',
    });
  }
</script>

<div class="max-w-lg mx-auto px-4 py-6 pb-24 flex flex-col gap-6">

  <!-- Header card -->
  <div class="bg-card rounded-3xl p-6 shadow-sm border border-border flex flex-col items-center gap-3 text-center">
    <div class="w-16 h-16 rounded-2xl overflow-hidden bg-muted">
      <img src="/logo.png" alt="Abbabal logo" class="w-full h-full object-cover" />
    </div>
    <div>
      <h2 class="text-xl font-bold">አባባል</h2>
      <p class="text-sm text-muted-foreground">Amharic Proverbs</p>
    </div>
    <span class="text-xs text-muted-foreground">Version {appVersion}</span>
  </div>

  <!-- Stats -->
  <div class="bg-card rounded-2xl p-4 border border-border flex items-center gap-4">
    <div class="flex-1 text-center">
      <p class="text-2xl font-bold">{saved.items.length}</p>
      <p class="text-xs text-muted-foreground mt-0.5">Saved proverbs</p>
    </div>
  </div>

  <!-- Sync -->
  <div class="bg-card rounded-2xl p-4 border border-border flex flex-col gap-3">
    <div class="flex items-center justify-between gap-3">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium">Offline database</p>
        <p class="text-xs text-muted-foreground mt-0.5">
          {#if lastSyncLabel}
            Last updated: {lastSyncLabel}
          {:else}
            Not synced yet — proverbs from the bundled database.
          {/if}
        </p>
      </div>
      <button
        onclick={syncNow}
        disabled={syncing}
        class="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
      >
        <RefreshCw size={15} class={syncing ? 'animate-spin' : ''} />
        {syncing ? 'Syncing…' : 'Sync DB'}
      </button>
    </div>
    {#if syncOk}
      <p class="text-xs text-emerald-600">Database updated successfully.</p>
    {/if}
    {#if syncError}
      <p class="text-xs text-red-500">{syncError}</p>
    {/if}
  </div>

  <!-- Actions -->
  <div class="flex flex-col gap-2">
    <button
      onclick={shareApp}
      class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border text-left active:scale-[0.99] transition-transform"
    >
      <Share2 size={18} class="text-primary shrink-0" />
      <span class="text-sm font-medium">Share the app</span>
    </button>

    {#if saved.items.length > 0}
      <button
        onclick={removeAll}
        class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-card border border-border text-left active:scale-[0.99] transition-transform"
      >
        <Trash2 size={18} class="text-red-500 shrink-0" />
        <span class="text-sm font-medium text-red-500">Clear saved proverbs</span>
      </button>
    {/if}
  </div>

  <!-- Footer note -->
  <div class="text-center text-xs text-muted-foreground">
    <p class="flex items-center justify-center gap-1.5">
      <Bookmark size={12} />
      Preserve wisdom. Share culture.
    </p>
  </div>

</div>
