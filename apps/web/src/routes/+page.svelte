<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    ArrowRight,
    BookOpen,
    Calendar,
    Check,
    Code2,
    Copy,
    Database,
    Heart,
    Search,
    Shuffle,
    Smartphone,
  } from '@lucide/svelte';
  import type { PageData } from './$types';
  import DataSource from '$lib/components/DataSource.svelte';

  let { data }: { data: PageData } = $props();

  let searchQuery = $state('');
  let copied = $state(false);

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

  const potd = $derived(data.potd);

  const potdTranslation = $derived(
    potd?.interpretations?.find((i) => i.type === 'translation' && i.language === 'en')?.content ?? null
  );

  async function copyPotdLink() {
    if (!potd) return;
    try {
      await navigator.clipboard.writeText(`${location.origin}/proverbs/${potd.id}`);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Real proverbs from the corpus, used in the editorial section
  const examples = [
    { id: 472, amharic: 'መራጭ ይወድቃል ከምራጭ', translation: 'The chooser falls from the chosen.' },
    { id: 745, amharic: 'ይጥሉህ አትጥላቸው ይበድሉህ አትበድላቸው', translation: 'Let them wrong you — don\u2019t wrong them.' },
    { id: 990, amharic: 'ቀላዋጭ ወጥ ያውቃል', translation: 'The stirrer knows the stew.' },
  ];
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
        Abbabal is a collection of {data.proverbCount ? Number(data.proverbCount).toLocaleString() : '3,000'}+ Amharic proverbs — preserving our heritage, sharing our wisdom.
      </p>
      <form onsubmit={handleSearch} class="mt-8 flex max-w-md items-center rounded-xl border border-border bg-card pl-5 pr-1.5 py-1.5 shadow-sm">
        <Search size={16} class="mr-3 shrink-0 text-muted-foreground" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search proverbs in Amharic or English..."
          class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        />
        <button type="submit" class="cursor-pointer rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          Search
        </button>
      </form>
    </div>

    <!-- SVG Illustration: open book showing today's proverb (Amharic left, English right) -->
    <div class="flex flex-col items-center">
      <svg
        viewBox="0 0 600 400"
        class="w-full max-w-[500px] drop-shadow-sm"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={potd ? `Today's proverb: ${potd.text}` : 'An open book with an Amharic proverb and its translation'}
      >
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

          <!-- Amharic proverb — left page (tilted +13° to match the page slope) -->
          <foreignObject x="139" y="145" width="152" height="104" transform="rotate(13 215 197)">
            <div xmlns="http://www.w3.org/1999/xhtml" class="flex h-full w-full items-center justify-center overflow-hidden px-2 text-center">
              <p class="font-ethiopic text-[15px] font-bold leading-snug text-[#3f4e28] line-clamp-4">
                {potd?.text ?? 'እምቡጥ እስካልቆፈረ አይበቅልም::'}
              </p>
            </div>
          </foreignObject>

          <!-- English translation — right page (tilted -11° to match the page slope) -->
          <foreignObject x="297" y="150" width="140" height="100" transform="rotate(-11 367 200)">
            <div xmlns="http://www.w3.org/1999/xhtml" class="flex h-full w-full items-center justify-center overflow-hidden px-1 text-center">
              <p class="font-serif text-[12px] italic leading-snug text-[#7a6f60] line-clamp-5">
                {potdTranslation ?? 'Until the bud is pierced, it does not grow.'}
              </p>
            </div>
          </foreignObject>
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
      {#if potd}
        <a
          href={`/proverbs/${potd.id}`}
          class="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Today's proverb <ArrowRight size={12} />
        </a>
      {/if}
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

  <!-- Proverb of the Day -->
  <section class="mb-12 rounded-2xl bg-secondary p-8 md:p-10">
    <div class="mb-6 flex flex-wrap items-center gap-3">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-primary">
        <Calendar size={16} strokeWidth={2} />
      </div>
      <div class="mr-auto">
        <h4 class="text-sm font-bold">Proverb of the Day</h4>
        <p class="text-xs text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
      {#if potd}
        <button
          onclick={copyPotdLink}
          class="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Copy link to today's proverb"
        >
          {#if copied}
            <Check size={14} class="text-primary" /> Copied!
          {:else}
            <Copy size={14} /> Copy link
          {/if}
        </button>
      {/if}
    </div>

    <div class="grid items-center gap-10 md:grid-cols-[2fr_1fr]">
      <div class="md:border-r md:border-border md:pr-10">
        {#if potd}
          <p class="font-ethiopic text-2xl font-bold leading-relaxed text-foreground">
            {potd.text}
          </p>
          {#if potd.interpretations?.length}
            {#each potd.interpretations.filter((i) => i.type === 'translation' && i.language === 'en') as t}
              <p class="mt-3 text-sm italic text-muted-foreground">&ldquo;{t.content}&rdquo;</p>
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

  <!-- Recently Added -->
  {#if data.recent.length > 0}
    <section class="mb-16">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <h4 class="text-sm font-bold">Recently Added</h4>
          <p class="text-xs text-muted-foreground">Fresh from our collection</p>
        </div>
        <a href="/proverbs" class="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80">
          View all <ArrowRight size={12} />
        </a>
      </div>
      <div class="-mx-6 flex gap-4 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {#each data.recent as p (p.id)}
          <a
            href={`/proverbs/${p.id}`}
            class="group flex min-w-[240px] max-w-[240px] shrink-0 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50"
          >
            <span class="text-[10px] font-bold uppercase tracking-widest text-primary">#{String(p.id).padStart(4, '0')}</span>
            <span class="mt-3 font-ethiopic text-lg font-bold leading-snug text-foreground line-clamp-3 transition-colors group-hover:text-primary">{p.text}</span>
            <span class="mt-auto pt-3 text-[10px] font-medium text-muted-foreground">{formatDate(p.date)}</span>
          </a>
        {/each}
      </div>
    </section>
  {/if}

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

  <!-- Editorial: What is an Amharic proverb? -->
  <section class="mb-16 grid gap-10 md:grid-cols-2 md:items-center">
    <div>
      <p class="text-xs font-bold uppercase tracking-[0.08em] text-primary">The Tradition</p>
      <h2 class="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">What is an Amharic proverb?</h2>
      <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
        Amharic proverbs — ምሳሌ (məsale) — are short, poetic sayings handed down through generations of oral tradition. They capture everyday wisdom about patience, community, honesty, and resilience in a few carefully chosen words.
      </p>
      <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
        Each one is a small mirror of Ethiopian culture: a lesson you can carry through the day, spoken the way a grandmother would say it. Abbabal collects these sayings, translates them, and explains the meaning behind them — so the wisdom stays alive.
      </p>
      <a href="/proverbs" class="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
        Explore the collection <ArrowRight size={14} />
      </a>
    </div>
    <div class="flex flex-col gap-4">
      {#each examples as ex}
        <a href={`/proverbs/${ex.id}`} class="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50">
          <p class="font-ethiopic text-lg font-bold leading-snug text-foreground">{ex.amharic}</p>
          <p class="mt-1 text-sm text-muted-foreground">&ldquo;{ex.translation}&rdquo;</p>
        </a>
      {/each}
    </div>
  </section>

  <!-- Data Source -->
  <section class="mb-16 md:max-w-xl">
    <DataSource />
  </section>

  <!-- Developer Band -->
  <section class="mb-16 overflow-hidden rounded-2xl bg-[#1a1d16] p-8 text-[#e8e6dc] md:p-10">
    <div class="grid items-center gap-10 md:grid-cols-2">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.08em] text-[#a3b87a]">For Developers</p>
        <h2 class="mt-3 text-2xl font-extrabold tracking-tight">One command to start exploring.</h2>
        <p class="mt-3 max-w-md text-sm leading-relaxed text-[#9a9f8e]">
          The full corpus is one REST call away — no API key, no signup. Browse the live playground or read the documentation to build with it.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a href="/playground" class="inline-flex items-center gap-2 rounded-lg bg-[#a3b87a] px-5 py-2.5 text-xs font-semibold text-[#1a1d16] transition-colors hover:bg-[#b5c98c]">
            <Code2 size={15} /> Open the Playground <ArrowRight size={14} />
          </a>
          <a href="/documentation" class="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-xs font-semibold text-[#e8e6dc] transition-colors hover:bg-white/5">
            Read the docs
          </a>
        </div>
      </div>
      <div class="rounded-xl border border-white/10 bg-black/30 p-5 font-mono text-xs leading-relaxed">
        <div class="mb-3 flex gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-[#f45b69]"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-[#f5c542]"></span>
          <span class="h-2.5 w-2.5 rounded-full bg-[#59c353]"></span>
        </div>
        <p><span class="text-[#a3b87a]">$</span> curl https://abbabal-api.onrender.com/proverbs/random</p>
        <p class="mt-3 text-[#9a9f8e]">{'{'}</p>
        <p class="pl-4 text-[#9a9f8e]">&quot;text&quot;: <span class="text-[#e8e6dc]">&quot;መራጭ ይወድቃል ከምራጭ&quot;</span>,</p>
        <p class="pl-4 text-[#9a9f8e]">&quot;date&quot;: <span class="text-[#e8e6dc]">&quot;2026-03-25&quot;</span>,</p>
        <p class="pl-4 text-[#9a9f8e]">&quot;interpretations&quot;: [<span class="text-[#e8e6dc]">…</span>]</p>
        <p class="text-[#9a9f8e]">{'\}'}</p>
      </div>
    </div>
  </section>

  <!-- Get the App -->
  <section class="mb-16 flex flex-col gap-8 rounded-2xl border border-border bg-secondary p-8 md:flex-row md:items-center md:justify-between md:p-10">
    <div class="flex items-start gap-5">
      <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
        <Smartphone size={28} />
      </div>
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.08em] text-primary">Mobile App</p>
        <h2 class="mt-2 text-2xl font-extrabold tracking-tight">The wisdom, in your pocket.</h2>
        <p class="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Abbabal for Android — daily proverbs, favorites, search, and full offline access. Currently in development.
        </p>
        <div class="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-foreground">
          <span class="flex items-center gap-1.5"><BookOpen size={13} class="text-primary" /> Daily wisdom</span>
          <span class="flex items-center gap-1.5"><Heart size={13} class="text-primary" /> Save favorites</span>
          <span class="flex items-center gap-1.5"><Database size={13} class="text-primary" /> Offline access</span>
        </div>
      </div>
    </div>
    <a href="/download" class="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:self-auto">
      See the app page <ArrowRight size={14} />
    </a>
  </section>
</div>
