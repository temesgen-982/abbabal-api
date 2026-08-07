<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowRight, BookOpen, Database, Heart, Shuffle, Search } from '@lucide/svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  let searchQuery = $state('');

  function handleSearch(e: Event) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      goto(`/proverbs?search=${encodeURIComponent(q)}`);
    } else {
      goto('/proverbs');
    }
  }

  const stats = $derived([
    { label: 'Proverbs', value: data.proverbCount ? Number(data.proverbCount).toLocaleString() : '—', icon: BookOpen },
    { label: 'License', value: 'Open', icon: Heart, sub: 'MIT Licensed' },
    { label: 'Tables', value: '2', icon: Database, sub: 'Proverbs & Interpretations' },
    { label: 'Mission', value: 'One', icon: Shuffle, sub: 'Preserve wisdom. Share culture.' },
  ]);

  const potd = $derived(data.randomProverb);
</script>

<div class="mx-auto max-w-7xl px-6">
  <!-- Hero -->
  <section class="grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
    <div>
      <h1 class="text-[2.6rem] font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-[3.25rem]">
        Wisdom.<br />
        In Amharic.<br />
        <span class="text-primary">Open to all.</span>
      </h1>
      <p class="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
        Abbabal is a collection of {data.proverbCount ? Number(data.proverbCount).toLocaleString() : '7,000+'}+ Amharic proverbs — preserving our heritage, sharing our wisdom.
      </p>
      <form onsubmit={handleSearch} class="mt-8 flex max-w-md items-center rounded-full border border-border bg-card pl-5 pr-1.5 py-1.5 shadow-sm">
        <Search size={16} class="mr-3 shrink-0 text-muted-foreground" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search proverbs in Amharic or English..."
          class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <button type="submit" class="cursor-pointer rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          Search
        </button>
      </form>
    </div>

    <!-- SVG Illustration -->
    <div class="flex justify-center">
      <svg viewBox="0 0 600 400" class="w-full max-w-[500px] drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="s1" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" flood-opacity="0.08"/>
          </filter>
        </defs>
        <g fill="#718355" opacity="0.8">
          <path d="M 330 180 C 310 120, 360 60, 370 40 C 390 80, 380 140, 330 180 Z" />
          <path d="M 350 140 C 380 120, 420 120, 440 130 C 410 150, 380 160, 350 140 Z" />
          <path d="M 310 130 C 280 100, 270 60, 280 40 C 300 70, 310 100, 310 130 Z" />
        </g>
        <g filter="url(#s1)">
          <path d="M 270 280 L 450 250 L 480 150 L 300 170 Z" fill="#b08968" />
          <path d="M 270 280 L 110 230 L 130 130 L 300 170 Z" fill="#8c6239" />
          <path d="M 295 270 Q 200 250 120 220 L 140 125 Q 210 155 295 165 Z" fill="#fefae0" stroke="#e9edc9" stroke-width="2"/>
          <path d="M 295 270 Q 380 240 460 230 L 440 135 Q 370 145 295 165 Z" fill="#fffdf5" stroke="#e9edc9" stroke-width="2"/>
          <text x="375" y="185" font-family="'Noto Sans Ethiopic', sans-serif" font-weight="bold" font-size="15" fill="#3f4e28" text-anchor="middle">ቃለ እውቀት</text>
          <text x="375" y="210" font-family="'Noto Sans Ethiopic', sans-serif" font-weight="bold" font-size="14" fill="#3f4e28" text-anchor="middle">የሕይወት መሠረት ነው::</text>
        </g>
        <g filter="url(#s1)">
          <path d="M 450 220 Q 480 170 510 220 Q 480 250 450 220 Z" fill="#dda15e" />
          <ellipse cx="480" cy="170" rx="25" ry="10" fill="#bc6c25" />
          <path d="M 470 170 L 480 130 L 490 170 Z" fill="#dda15e" />
        </g>
        <g filter="url(#s1)">
          <ellipse cx="450" cy="245" rx="25" ry="12" fill="var(--primary, #596b38)" />
          <ellipse cx="450" cy="243" rx="21" ry="9" fill="#ffffff" />
          <ellipse cx="450" cy="243" rx="17" ry="6" fill="#28150c" />
        </g>
      </svg>
    </div>
  </section>

  <!-- Stats Bar -->
  <div class="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-card shadow-sm md:grid-cols-4">
    {#each stats as stat, i}
      <div class="flex items-center gap-4 bg-card p-5 {i < stats.length - 1 ? 'border-r border-border/50' : ''}">
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-primary">
          <stat.icon size={18} strokeWidth={2} />
        </div>
        <div>
          <div class="text-base font-bold">{stat.value}</div>
          <div class="text-xs text-muted-foreground">{stat.sub ?? stat.label}</div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Random Proverb Card -->
  <section class="mb-16 rounded-2xl bg-secondary p-8 md:p-10">
    <div class="mb-6 flex items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
        <Shuffle size={16} strokeWidth={2} />
      </div>
      <div>
        <h4 class="text-sm font-bold">Random Proverb</h4>
        <p class="text-xs text-muted-foreground">Discover timeless wisdom</p>
      </div>
    </div>

    <div class="grid items-center gap-10 md:grid-cols-[2fr_1fr]">
      <div class="md:border-r md:border-border md:pr-10">
        {#if potd}
          <p class="font-ethiopic text-2xl font-bold leading-relaxed text-foreground">
            {potd.amharic ?? potd.text}
          </p>
          {#if potd.transliteration}
            <p class="mt-2 text-sm font-semibold text-primary">{potd.transliteration}</p>
          {/if}
          {#if potd.literal_translation}
            <p class="mt-1 text-sm font-medium">{potd.literal_translation}</p>
          {/if}
          <!-- Check nested interpretations for translation -->
          {#if potd.interpretations?.length}
            {#each potd.interpretations.filter((i: Record<string, unknown>) => (i as { type: string; language: string; content: string }).type === 'translation' && (i as { type: string; language: string; content: string }).language === 'en') as t}
              <p class="mt-3 text-sm italic text-muted-foreground">&ldquo;{(t as { content: string }).content}&rdquo;</p>
            {/each}
          {/if}
        {:else}
          <p class="font-ethiopic text-2xl font-bold leading-relaxed text-foreground">
            እምቡጥ እስካልቆፈረ አይበቅልም::
          </p>
          <p class="mt-2 text-sm font-medium">Until the bud is pierced, it does not grow.</p>
        {/if}
        <a href={potd ? `/proverbs/${potd.id}` : '/proverbs'} class="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          View Explanation
          <ArrowRight size={14} />
        </a>
      </div>

      <div class="hidden flex-col items-center justify-center md:flex">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="mb-6 text-muted-foreground/20"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="mb-16 grid gap-6 md:grid-cols-4">
    {#each [
      { icon: BookOpen, title: 'Original & Authentic', desc: 'Proverbs in Amharic as they were spoken.' },
      { icon: Heart, title: 'Meanings & Context', desc: 'Understand the deeper wisdom behind each.' },
      { icon: Database, title: 'Developer Friendly', desc: 'Simple REST API and offline SQLite database.' },
      { icon: Shuffle, title: 'Growing Daily', desc: 'New proverbs added regularly from our community.' },
    ] as feature}
      <div class="flex gap-4">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
          <feature.icon size={16} strokeWidth={2} />
        </div>
        <div>
          <h5 class="text-sm font-bold">{feature.title}</h5>
          <p class="mt-1 text-xs leading-relaxed text-muted-foreground">{feature.desc}</p>
        </div>
      </div>
    {/each}
  </section>
</div>
