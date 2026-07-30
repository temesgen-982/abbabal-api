<script lang="ts">
  import { page } from '$app/stores';
  import { Database, Globe, Code, Shield, Gauge, BookOpen, ArrowRight, ExternalLink, Copy, Check, Leaf } from '@lucide/svelte';
  import { PUBLIC_API_BASE_URL } from '$env/static/public';

  const baseUrl = $derived((PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, ''));

  let activeSection = $state('overview');
  let copiedCurl = $state(false);
  let copiedUrl = $state(false);
  let copiedAuth = $state(false);

  function scrollTo(id: string) {
    activeSection = id;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  async function copy(text: string, setDone: (v: boolean) => void) {
    await navigator.clipboard.writeText(text);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  const endpoints = [
    { method: 'GET', name: 'List Proverbs', path: '/proverbs', desc: 'Paginated list of all proverbs' },
    { method: 'GET', name: 'Get Proverb', path: '/proverbs/{id}', desc: 'Single proverb with interpretations' },
    { method: 'GET', name: 'Search Proverbs', path: '/proverbs/search?q=', desc: 'Search by text or translations' },
    { method: 'GET', name: 'Random Proverb', path: '/proverbs/random', desc: 'Random proverb of the day' },
    { method: 'GET', name: 'Stats', path: '/stats', desc: 'Archive statistics and metadata' },
  ];

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'example', label: 'Example' },
  ];
</script>

<div class="mx-auto max-w-7xl px-6">
  <div class="grid gap-8 py-10 md:grid-cols-[220px_1fr] md:py-12">
    <!-- Sidebar -->
    <aside class="hidden md:block">
      <div class="sticky top-24 space-y-6">
        <div>
          <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">Documentation</p>
          <ul class="flex flex-col gap-0.5">
            {#each sections as s}
              <li>
                <button onclick={() => scrollTo(s.id)} class="w-full rounded-md px-3 py-2 text-left text-xs font-medium transition-colors {activeSection === s.id ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}">
                  {s.label}
                </button>
              </li>
            {/each}
          </ul>
        </div>

        <div>
          <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.06em] text-muted-foreground">Endpoints</p>
          <ul class="flex flex-col gap-0.5">
            {#each endpoints as ep}
              <li>
                <button onclick={() => scrollTo('endpoints')} class="w-full rounded-md px-3 py-2 text-left transition-colors text-muted-foreground hover:text-foreground hover:bg-muted">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] font-bold text-primary">{ep.method}</span>
                      <span class="text-xs font-medium">{ep.name}</span>
                    </div>
                  </div>
                  <p class="mt-0.5 font-mono text-[9px] text-muted-foreground/60">{ep.path}</p>
                </button>
              </li>
            {/each}
          </ul>
        </div>

        <div class="rounded-xl border border-border bg-secondary p-4">
          <div class="flex items-center gap-2.5">
            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-primary">
              <BookOpen size={12} />
            </div>
            <div>
              <p class="text-xs font-bold">Need help?</p>
              <p class="text-[10px] text-muted-foreground">Open an issue on GitHub</p>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Content -->
    <main class="space-y-10">
      <!-- Hero -->
      <section id="overview">
        <div class="grid items-center gap-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h1 class="text-[2.4rem] font-extrabold leading-[1.1] tracking-tight md:text-[2.6rem]">
              Abbabal <span class="text-primary">API</span>
            </h1>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground">
              Programmatic access to thousands of Amharic proverbs and their interpretations. JSON over HTTPS — simple, powerful, and built for developers.
            </p>
            <div class="mt-6 flex gap-3">
              <a href="{baseUrl}/proverbs?limit=2" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                <Code size={14} />
                Try it now
              </a>
              <a href="https://github.com/beshoi/abbabal-api" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-xs font-semibold transition-colors hover:bg-muted">
                <ExternalLink size={14} />
                View on GitHub
              </a>
            </div>
          </div>

          <!-- Code Preview -->
          <div class="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div class="mb-3 flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 rounded-full bg-muted-foreground/20"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-muted-foreground/20"></span>
              <span class="h-2.5 w-2.5 rounded-full bg-muted-foreground/20"></span>
              <span class="ml-2 rounded-full bg-muted px-2.5 py-0.5 font-mono text-[9px] text-muted-foreground">{baseUrl}/proverbs</span>
            </div>
            <div class="rounded-xl bg-background p-4 font-mono text-[11px] leading-relaxed">
              <span class="text-primary font-semibold">GET</span><br /><br />
              {'{'}<br />
              <span class="pl-3"><span class="text-primary">&quot;id&quot;</span>: <span class="text-amber-600">1</span>,</span><br />
              <span class="pl-3"><span class="text-primary">&quot;text&quot;</span>: <span class="text-amber-600">&quot;ቀስ ብሎ ለሚሰራ ትልቅ ስራ ይሆናል።&quot;</span>,</span><br />
              <span class="pl-3"><span class="text-primary">&quot;interpretations&quot;</span>: [ ... ]</span><br />
              {'}'}
            </div>
          </div>
        </div>
      </section>

      <!-- Features Bar -->
      <div class="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 md:grid-cols-5">
        {#each [
          { icon: Database, title: '7,000+ Proverbs', desc: 'Growing collection' },
          { icon: BookOpen, title: 'Rich Data', desc: 'Proverbs & meanings' },
          { icon: Globe, title: 'RESTful API', desc: 'JSON over HTTPS' },
          { icon: Gauge, title: 'Rate Limited', desc: 'Fair & reliable' },
          { icon: Shield, title: 'Open & Free', desc: 'MIT Licensed' },
        ] as feat}
          <div class="flex items-center gap-3">
            <feat.icon size={18} class="shrink-0 text-primary" />
            <div>
              <p class="text-xs font-bold">{feat.title}</p>
              <p class="text-[10px] text-muted-foreground">{feat.desc}</p>
            </div>
          </div>
        {/each}
      </div>

      <!-- Endpoints -->
      <section id="endpoints">
        <h2 class="text-2xl font-extrabold">Endpoints</h2>
        <p class="mt-1 text-sm text-muted-foreground">All endpoints return JSON. No authentication required.</p>

        <div class="mt-6 space-y-3">
          {#each endpoints as ep}
            <div class="rounded-xl border border-border bg-card p-5">
              <div class="flex items-center gap-3">
                <span class="rounded bg-muted px-2 py-1 font-mono text-[10px] font-bold text-primary">{ep.method}</span>
                <span class="font-mono text-sm font-semibold">{ep.path}</span>
              </div>
              <p class="mt-1.5 text-xs text-muted-foreground">{ep.desc}</p>
            </div>
          {/each}
        </div>
      </section>

      <!-- Example -->
      <section id="example">
        <h2 class="text-2xl font-extrabold">Example Request</h2>

        <div class="mt-4 flex items-center gap-3 rounded-xl bg-muted px-5 py-3 font-mono text-sm font-semibold">
          <span class="rounded bg-muted-foreground/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">GET</span>
          <span>{baseUrl}/proverbs?limit=2</span>
        </div>

        <!-- curl block -->
        <div class="mt-4 overflow-hidden rounded-xl border border-border bg-[#1e241b]">
          <div class="flex items-center justify-between border-b border-white/5 bg-[#272f23] px-4 py-2">
            <div class="flex gap-4">
              <span class="border-b-2 border-primary pb-0.5 text-xs font-semibold text-white">cURL</span>
              <span class="text-xs font-semibold text-[#8fa086]">JavaScript (fetch)</span>
              <span class="text-xs font-semibold text-[#8fa086]">Python (requests)</span>
            </div>
            <button onclick={() => copy(`curl -X GET "${baseUrl}/proverbs?limit=2" -H "Accept: application/json"`, { get value() { return copiedCurl; }, set value(v) { copiedCurl = v; } })} class="flex items-center gap-1.5 text-xs text-[#8fa086] transition-colors hover:text-white">
              {#if copiedCurl}
                <Check size={12} /> Copied
              {:else}
                <Copy size={12} /> Copy
              {/if}
            </button>
          </div>
          <div class="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-[#d8dee9]">
            <div><span class="text-[#81a1c1]">curl</span> -X GET <span class="text-[#ebcb8b]">&quot;{baseUrl}/proverbs?limit=2&quot;</span> \</div>
            <div class="pl-4">-H <span class="text-[#ebcb8b]">&quot;Accept: application/json&quot;</span></div>
          </div>
        </div>

        <h2 class="mt-8 text-2xl font-extrabold">Example Response</h2>

        <div class="mt-4 overflow-hidden rounded-xl border border-border bg-[#1e241b]">
          <div class="flex items-center justify-between border-b border-white/5 bg-[#272f23] px-4 py-2">
            <div class="flex gap-4">
              <span class="border-b-2 border-primary pb-0.5 text-xs font-semibold text-white">JSON</span>
            </div>
            <button onclick={() => copy(JSON.stringify({ page: 1, limit: 2, total: 7576, results: [{ id: 7790, text: "ወሬ ማዳመጥ ጥበብ አይደለም", date: "2026-03-25T00:00:00.000Z", source: "telegram" }] }, null, 2), { get value() { return false; }, set value(v) {} })} class="flex items-center gap-1.5 text-xs text-[#8fa086] transition-colors hover:text-white">
              <Copy size={12} /> Copy
            </button>
          </div>
          <div class="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-[#d8dee9]">
{'{'}<br />
<span class="pl-3"><span class="text-[#a3be8c]">&quot;page&quot;</span>: 1,</span><br />
<span class="pl-3"><span class="text-[#a3be8c]">&quot;limit&quot;</span>: 2,</span><br />
<span class="pl-3"><span class="text-[#a3be8c]">&quot;total&quot;</span>: 7576,</span><br />
<span class="pl-3"><span class="text-[#a3be8c]">&quot;results&quot;</span>: [</span><br />
<span class="pl-6">{'{'}</span><br />
<span class="pl-8"><span class="text-[#a3be8c]">&quot;id&quot;</span>: 7790,</span><br />
<span class="pl-8"><span class="text-[#a3be8c]">&quot;text&quot;</span>: <span class="text-[#ebcb8b]">&quot;ወሬ ማዳመጥ ጥበብ አይደለም&quot;</span>,</span><br />
<span class="pl-8"><span class="text-[#a3be8c]">&quot;source&quot;</span>: <span class="text-[#ebcb8b]">&quot;telegram&quot;</span></span><br />
<span class="pl-6">{'}'}</span><br />
<span class="pl-3">]</span><br />
{'}'}
          </div>
        </div>
      </section>

      <!-- Info Cards -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Base URL -->
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="mb-3 flex items-center gap-2 text-sm font-bold">
            <Globe size={14} class="text-primary" /> Base URL
          </div>
          <div class="flex items-center justify-between rounded-lg bg-muted px-3 py-2 font-mono text-[11px]">
            <span>{baseUrl}</span>
            <button onclick={() => copy(baseUrl, { get value() { return copiedUrl; }, set value(v) { copiedUrl = v; } })} class="shrink-0 text-muted-foreground hover:text-foreground">
              {#if copiedUrl}<Check size={12} />{:else}<Copy size={12} />{/if}
            </button>
          </div>
        </div>

        <!-- Auth -->
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="mb-3 flex items-center gap-2 text-sm font-bold">
            <Shield size={14} class="text-primary" /> Authentication
          </div>
          <p class="mb-3 text-[11px] leading-relaxed text-muted-foreground">
            The API is open and free. No API key or authentication required. Just make your request.
          </p>
        </div>

        <!-- Rate Limits -->
        <div class="rounded-xl border border-border bg-card p-5">
          <div class="mb-3 flex items-center gap-2 text-sm font-bold">
            <Gauge size={14} class="text-primary" /> Rate Limits
          </div>
          <div class="space-y-1 text-xs">
            <div class="flex items-center justify-between">
              <span>100 requests / minute</span>
              <span class="rounded bg-muted px-2 py-0.5 text-[10px] font-semibold text-primary">Free</span>
            </div>
          </div>
          <p class="mt-3 text-[11px] text-muted-foreground">
            Contact us for higher limits.
          </p>
        </div>
      </div>

      <!-- Bottom Banner -->
      <div class="flex items-center justify-between rounded-2xl border border-border bg-muted/60 px-7 py-5">
        <div class="flex items-center gap-4">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-primary">
            <Leaf size={16} />
          </div>
          <div>
            <p class="text-sm font-bold">Open Data. Built for Everyone.</p>
            <p class="text-xs text-muted-foreground">Abbabal API is open and free to use under the MIT License.</p>
          </div>
        </div>
        <a href="https://github.com/beshoi/abbabal-api" target="_blank" rel="noreferrer" class="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted">
          View License <ExternalLink size={12} />
        </a>
      </div>
    </main>
  </div>
</div>
