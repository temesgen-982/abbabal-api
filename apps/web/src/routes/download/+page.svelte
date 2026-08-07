<script lang="ts">
  import { BookOpen, Database, Heart, Download, ExternalLink, ArrowUpRight, Smartphone } from '@lucide/svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  let activeTab = $state<'database' | 'mobile'>('database');
</script>

<div class="mx-auto max-w-7xl px-6">
  <!-- Hero -->
  <section class="grid items-start gap-10 py-10 md:grid-cols-[1fr_1.3fr] md:py-12">
    <div>
      <p class="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-primary">DOWNLOAD</p>
      <h1 class="text-[2.4rem] font-extrabold leading-[1.15] tracking-tight md:text-[2.6rem]">
        Take the <span class="text-primary">wisdom</span> with you.
      </h1>
      <p class="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Download our full dataset or mobile app and explore {data.proverbs ? Number(data.proverbs).toLocaleString() : '7,000+'}+ Amharic proverbs anytime, anywhere.
      </p>
      <div class="mt-6 flex gap-6 border-b border-border">
        <button onclick={() => activeTab = 'database'} class="flex items-center gap-2 pb-3 text-sm font-semibold transition-colors {activeTab === 'database' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground'}">
          <Database size={16} /> Database
        </button>
        <button onclick={() => activeTab = 'mobile'} class="flex items-center gap-2 pb-3 text-sm font-semibold transition-colors {activeTab === 'mobile' ? 'text-foreground border-b-2 border-primary' : 'text-muted-foreground'}">
          <Smartphone size={16} /> Mobile App
        </button>
      </div>
    </div>

    <!-- Download Card -->
    {#if activeTab === 'database'}
      <div class="rounded-2xl border border-border bg-muted/60 p-7">
        <div class="flex gap-5">
          <div class="relative flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#abb692] to-primary shadow-md">
            <Database size={28} class="text-white" />
          </div>
          <div>
            <div class="mb-1 flex items-center gap-2">
              <h3 class="text-lg font-bold">Abbabal SQLite Database</h3>
              <span class="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-primary">Recommended</span>
            </div>
            <p class="text-sm leading-relaxed text-muted-foreground">
              A complete, offline-ready SQLite database containing all proverbs, interpretations, and metadata.
            </p>
            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
              <span class="flex items-center gap-1.5"><Heart size={12} class="text-primary" /> {data.proverbs ? Number(data.proverbs).toLocaleString() : '7,000+'} proverbs</span>
              <span class="flex items-center gap-1.5"><Database size={12} class="text-primary" /> 2 tables</span>
              <span class="flex items-center gap-1.5"><BookOpen size={12} class="text-primary" /> UTF-8 encoded</span>
              <span class="flex items-center gap-1.5"><Heart size={12} class="text-primary" /> MIT License</span>
            </div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-3 gap-4 border-t border-border pt-4">
          <div>
            <p class="text-[10px] font-medium text-muted-foreground">File format</p>
            <p class="text-sm font-bold">SQLite 3 (.db)</p>
          </div>
          <div>
            <p class="text-[10px] font-medium text-muted-foreground">File size</p>
            <p class="text-sm font-bold">{data.dbSize || '~5 MB'}</p>
          </div>
          <div>
            <p class="text-[10px] font-medium text-muted-foreground">Last updated</p>
            <p class="text-sm font-bold">{data.dbUpdatedAt || '—'}</p>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-[1.5fr_1fr] gap-3">
          <a href="{data.baseUrl}/download" class="flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            <Download size={16} />
            Download abbabal.db
          </a>
          <a href="https://github.com/beshoi/abbabal-api" target="_blank" rel="noreferrer" class="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-3 text-sm font-semibold transition-colors hover:bg-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            View on GitHub
          </a>
        </div>
      </div>
    {:else}
      <div class="rounded-2xl border border-border bg-muted/60 p-7">
        <div class="flex gap-5">
          <div class="relative flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#abb692] to-primary shadow-md">
            <Smartphone size={28} class="text-white" />
          </div>
          <div>
            <div class="mb-1 flex items-center gap-2">
              <h3 class="text-lg font-bold">Abbabal Mobile App</h3>
              <span class="rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">Coming Soon</span>
            </div>
            <p class="text-sm leading-relaxed text-muted-foreground">
              A beautiful mobile experience with daily proverbs, search, favorites, and offline access — right in your pocket.
            </p>
            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium">
              <span class="flex items-center gap-1.5"><Heart size={12} class="text-primary" /> Daily inspiration</span>
              <span class="flex items-center gap-1.5"><BookOpen size={12} class="text-primary" /> Save favorites</span>
              <span class="flex items-center gap-1.5"><Database size={12} class="text-primary" /> Offline support</span>
              <span class="flex items-center gap-1.5"><Heart size={12} class="text-primary" /> Free & open</span>
            </div>
          </div>
        </div>

        <div class="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <p class="text-[10px] font-medium text-muted-foreground">Platform</p>
            <p class="text-sm font-bold">Android</p>
          </div>
          <div>
            <p class="text-[10px] font-medium text-muted-foreground">Status</p>
            <p class="text-sm font-bold">In Development</p>
          </div>
        </div>

        <div class="mt-5">
          <button disabled class="flex w-full items-center justify-center gap-2 rounded-lg bg-muted py-3 text-sm font-semibold text-muted-foreground cursor-not-allowed">
            <Download size={16} />
            Coming Soon
          </button>
        </div>
      </div>
    {/if}
  </section>

  <!-- Details Grid -->
  <section class="grid gap-8 pb-12 md:grid-cols-2">
    <!-- Schema -->
    <div class="rounded-2xl border border-border bg-card p-7 shadow-sm">
      <h4 class="text-base font-bold">Database Schema</h4>
      <p class="mt-1 text-xs text-muted-foreground">Abbabal database is simple and lightweight with two core tables.</p>

      <div class="mt-6 flex items-center gap-4">
        <div class="w-full rounded-lg border border-border bg-background text-xs">
          <div class="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2 font-bold">
            <Database size={12} /> proverbs
          </div>
          <div class="space-y-0">
            {#each [
              ['id', 'INTEGER (PK)'],
              ['amharic', 'TEXT'],
              ['transliteration', 'TEXT'],
              ['literal_translation', 'TEXT'],
              ['created_at', 'TEXT'],
              ['updated_at', 'TEXT'],
            ] as [col, type]}
              <div class="flex justify-between border-t border-border/50 px-3 py-1.5 font-mono text-[10px]">
                <span class="font-semibold">{col}</span>
                <span class="text-muted-foreground">{type}</span>
              </div>
            {/each}
          </div>
        </div>

        <div class="text-center text-xs text-muted-foreground font-bold">1 —— ∞</div>

        <div class="w-full rounded-lg border border-border bg-background text-xs">
          <div class="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2 font-bold">
            <Database size={12} /> interpretations
          </div>
          <div class="space-y-0">
            {#each [
              ['id', 'INTEGER (PK)'],
              ['proverb_id', 'INTEGER (FK)'],
              ['meaning', 'TEXT'],
              ['explanation', 'TEXT'],
              ['usage', 'TEXT'],
              ['created_at', 'TEXT'],
            ] as [col, type]}
              <div class="flex justify-between border-t border-border/50 px-3 py-1.5 font-mono text-[10px]">
                <span class="font-semibold">{col}</span>
                <span class="text-muted-foreground">{type}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="mt-4 rounded-lg bg-muted px-4 py-2.5 font-mono text-[11px]">
        <Database size={11} class="inline" /> Foreign Key: <span class="text-primary">interpretations.proverb_id → proverbs.id</span>
      </div>
    </div>

    <!-- Sample Data + Stats -->
    <div>
      <div class="rounded-2xl border border-border bg-card p-7 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h4 class="text-base font-bold">Sample Data</h4>
          <div class="flex gap-4">
            <span class="border-b-2 border-primary pb-0.5 text-xs font-semibold text-primary">Proverbs</span>
            <span class="text-xs font-semibold text-muted-foreground">Interpretations</span>
          </div>
        </div>

        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-muted-foreground">
              <th class="pb-2 pr-2 font-medium">ID</th>
              <th class="pb-2 pr-2 font-medium">Amharic Proverb</th>
              <th class="pb-2 font-medium">Literal Translation</th>
            </tr>
          </thead>
          <tbody class="text-foreground">
            <tr class="border-t border-border">
              <td class="py-2.5 pr-2 font-mono">1</td>
              <td class="py-2.5 pr-2 font-ethiopic font-semibold">በቀስ በቀስ ተራራ ይወጣል።</td>
              <td class="py-2.5">Slowly, slowly, a mountain is climbed.</td>
            </tr>
            <tr class="border-t border-border">
              <td class="py-2.5 pr-2 font-mono">2</td>
              <td class="py-2.5 pr-2 font-ethiopic font-semibold">ከልብ ካለ መንገድ አለ</td>
              <td class="py-2.5">Where there is a will, there is a way.</td>
            </tr>
            <tr class="border-t border-border">
              <td class="py-2.5 pr-2 font-mono">3</td>
              <td class="py-2.5 pr-2 font-ethiopic font-semibold">እንበሳ ብቻውን አይበላም</td>
              <td class="py-2.5">A lion does not eat alone.</td>
            </tr>
          </tbody>
        </table>

        <a href="/proverbs" class="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          View more <ArrowUpRight size={12} />
        </a>
      </div>

      <!-- Mini Stats -->
      <div class="mt-4 grid grid-cols-3 gap-4">
        {#each [
          { icon: BookOpen, value: data.proverbs ? Number(data.proverbs).toLocaleString() : '7,000+', label: 'Proverbs and growing' },
          { icon: Database, value: '2', label: 'Tables Simple & efficient' },
          { icon: Heart, value: '100%', label: 'Open Data MIT Licensed' },
        ] as stat}
          <div class="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-primary">
              <stat.icon size={14} />
            </div>
            <div>
              <p class="text-sm font-extrabold">{stat.value}</p>
              <p class="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Bottom Banner -->
  <div class="mb-16 flex items-center justify-between rounded-2xl border border-border bg-muted/60 px-7 py-5">
    <div class="flex items-center gap-4">
      <Heart size={24} class="text-primary" />
      <div>
        <h5 class="text-sm font-bold">Using Abbabal data?</h5>
        <p class="text-xs text-muted-foreground">We'd love to see what you build! If Abbabal helps your project or research, consider giving us credit.</p>
      </div>
    </div>
    <a href="/about" class="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted">
      How to credit <ExternalLink size={12} />
    </a>
  </div>
</div>
