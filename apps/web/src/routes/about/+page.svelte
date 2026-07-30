<script lang="ts">
  import { BookOpen, Download, Database, Heart, Shield, Code, Leaf, Users, ArrowRight, ExternalLink } from '@lucide/svelte';
</script>

<div class="mx-auto max-w-7xl px-6">
  <!-- Hero -->
  <section class="grid items-center gap-10 py-10 md:grid-cols-[1fr_1.1fr] md:py-14">
    <div>
      <p class="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-primary">ABOUT ABBABAL</p>
      <h1 class="text-[2.4rem] font-extrabold leading-[1.15] tracking-tight md:text-[2.75rem]">
        Preserving <span class="text-primary">wisdom</span>.<br />
        Sharing <span class="text-primary">culture</span>.
      </h1>
      <p class="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Abbabal is a digital home for Amharic proverbs and the wisdom they carry. We collect, verify, and organize proverbs and their interpretations, then make them open and accessible for everyone — today and for generations to come.
      </p>
      <div class="mt-6 flex gap-3">
        <a href="/proverbs" class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          <BookOpen size={14} />
          Explore Proverbs
        </a>
        <a href="/download" class="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-xs font-semibold transition-colors hover:bg-muted">
          <Download size={14} />
          Download Database
        </a>
      </div>
    </div>

    <!-- Tree SVG -->
    <div class="flex justify-center">
      <svg width="240" height="240" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="40" r="30" fill="#596b38" opacity="0.15" />
        <circle cx="35" cy="35" r="20" fill="#596b38" opacity="0.2" />
        <circle cx="65" cy="35" r="20" fill="#596b38" opacity="0.2" />
        <path d="M48 85V55C48 50 42 45 40 40M52 85V55C52 50 58 45 60 40M45 50C48 48 50 44 50 40" stroke="#3f4e28" stroke-width="4" stroke-linecap="round" />
        <path d="M50 35C40 25 25 35 30 45C20 45 20 60 35 60C35 65 50 68 50 60C55 68 70 65 70 60C85 60 85 45 75 45C80 35 65 25 50 35Z" fill="#596b38" />
      </svg>
    </div>
  </section>

  <!-- Metrics Bar -->
  <div class="mb-12 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm md:grid-cols-4">
    {#each [
      { icon: BookOpen, value: '7,000+', label: 'Proverbs and growing' },
      { icon: Heart, value: 'Open', label: 'for everyone MIT Licensed' },
      { icon: Database, value: '2', label: 'Core Tables Proverbs & Interpretations' },
      { icon: Leaf, value: 'One', label: 'Mission: Preserve wisdom. Share culture.' },
    ] as stat}
      <div class="flex items-center gap-4">
        <stat.icon size={24} class="shrink-0 text-primary" />
        <div>
          <p class="text-lg font-extrabold">{stat.value}</p>
          <p class="text-[10px] text-muted-foreground">{stat.label}</p>
        </div>
      </div>
    {/each}
  </div>

  <!-- Story Grid -->
  <section class="mb-6 grid gap-8 md:grid-cols-2">
    <div class="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div class="mb-4 flex items-center gap-2.5">
        <Leaf size={20} class="text-primary" />
        <h3 class="text-xl font-extrabold">Our Story</h3>
      </div>
      <p class="mb-3 text-sm leading-relaxed text-muted-foreground">
        Abbabal started as a simple idea: What if thousands of Amharic proverbs, scattered in notebooks, books, and conversations, could live in one open place — for everyone to read, learn, and build with?
      </p>
      <p class="mb-3 text-sm leading-relaxed text-muted-foreground">
        We gathered proverbs from many sources, verified them carefully, and paired each one with clear interpretations. Then we built the tools — a website, an API, and a mobile app — to make this wisdom easy to access and use.
      </p>
      <p class="text-sm leading-relaxed text-muted-foreground">
        Today, Abbabal is an open platform for learning, research, and creativity.
      </p>
    </div>

    <div class="relative flex flex-col justify-center rounded-2xl border border-border bg-muted/60 bg-[radial-gradient(circle_at_right_bottom,rgba(89,107,56,0.08),transparent_70%)] p-9">
      <p class="text-4xl leading-none text-primary">&#8220;</p>
      <p class="font-ethiopic mt-3 text-2xl font-bold">የትምህርት እሴት በቲወጂ ይሞታል፡</p>
      <p class="mt-1 text-xs text-muted-foreground">(Ye-timirt eset be-tweded yetebekal.)</p>
      <p class="mt-4 text-sm font-semibold">The value of wisdom remains through generations.</p>
      <p class="text-xs text-muted-foreground">(Wisdom that is useful is never forgotten.)</p>
    </div>
  </section>

  <!-- Behind Story Banner -->
  <div class="mb-12 flex items-center justify-between rounded-xl border border-border bg-muted/60 px-6 py-4">
    <div class="flex items-center gap-3">
      <Leaf size={16} class="text-primary" />
      <div>
        <p class="text-sm font-bold">Want the full behind-the-scenes story?</p>
        <p class="text-xs text-muted-foreground">See how Abbabal was made, the challenges we faced, and the stack we used.</p>
      </div>
    </div>
    <a href="https://github.com/beshoi/abbabal-api" target="_blank" rel="noreferrer" class="flex shrink-0 items-center gap-1 text-xs font-bold text-primary">
      Read the full story <ArrowRight size={12} />
    </a>
  </div>

  <!-- What Makes Abbabal Special -->
  <section class="mb-12">
    <h3 class="mb-5 text-2xl font-extrabold">What Makes Abbabal Special</h3>
    <div class="grid gap-5 md:grid-cols-4">
      {#each [
        { icon: Shield, title: 'Authentic & Verified', desc: 'Collected from elders, books, archives, and everyday life. Reviewed and cleaned for accuracy and authenticity.' },
        { icon: Heart, title: 'Open & Free', desc: 'Open data under the MIT License. Use it in your projects, research, apps, and products — freely.' },
        { icon: Code, title: 'Developer Friendly', desc: 'Well-structured data, a simple REST API, and clear docs to help you build something meaningful.' },
        { icon: Leaf, title: 'Built for the Future', desc: 'We\'re building tools and resources that keep Amharic wisdom alive in the digital age.' },
      ] as feature}
        <div class="rounded-xl border border-border bg-card p-5 shadow-sm">
          <feature.icon size={20} class="mb-3 text-primary" />
          <h4 class="text-sm font-bold">{feature.title}</h4>
          <p class="mt-1 text-[11px] leading-relaxed text-muted-foreground">{feature.desc}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- Tech & Creator Grid -->
  <section class="mb-16 grid gap-8 md:grid-cols-2">
    <!-- Tech Card -->
    <div class="rounded-2xl border border-border bg-card p-7 shadow-sm">
      <div class="mb-3 flex items-center gap-3">
        <Database size={20} class="text-primary" />
        <h3 class="text-lg font-bold">Data & Technology</h3>
      </div>
      <p class="mb-6 text-xs text-muted-foreground">Structured Data: Abbabal is built on a clean, relational structure with two core tables.</p>

      <div class="mb-5 grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div class="rounded-lg border border-border bg-background p-3 font-mono text-[10px]">
          <strong>proverbs</strong><br />
          id (PK)<br />
          amharic_text<br />
          transliteration<br />
          literal_translation<br />
          ...
        </div>
        <div>
          <p class="mb-2 text-[11px] font-bold">Modern Stack</p>
          <p class="mb-3 text-[10px] text-muted-foreground">Built with modern, open source technologies.</p>
          <div class="flex flex-col gap-2 text-[11px]">
            {#each [
              { icon: Code, label: 'Backend', value: 'NestJS' },
              { icon: Database, label: 'Database', value: 'SQLite' },
              { icon: Code, label: 'API', value: 'REST (JSON)' },
              { icon: Shield, label: 'License', value: 'MIT' },
            ] as tech}
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-1.5 text-muted-foreground">
                  <tech.icon size={11} class="text-primary" />
                  {tech.label}
                </span>
                <span class="font-semibold">{tech.value}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <a href="/documentation" class="inline-flex items-center gap-1 text-xs font-semibold text-primary">
        Explore the API <ArrowRight size={12} />
      </a>
    </div>

    <!-- Creator & Community -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div class="h-[100px] w-[100px] shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" alt="Temesgen Adane" class="h-full w-full object-cover" />
        </div>
        <div>
          <h4 class="text-base font-bold">Temesgen Adane</h4>
          <p class="text-[11px] font-semibold text-primary">Developer & Founder</p>
          <p class="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Based in Ethiopia. Passionate about open data, culture, and tools that empower people.
          </p>
          <p class="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            I believe that preserving our wisdom is one of the best ways to build a better future.
          </p>
          <a href="https://github.com/beshoi" target="_blank" rel="noreferrer" class="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
            More about me <ArrowRight size={11} />
          </a>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <Users size={20} class="text-primary" />
        <div>
          <h4 class="text-sm font-bold">A Community Effort</h4>
          <p class="text-xs text-muted-foreground">Abbabal grows with your help. Contribute proverbs, improve translations, report issues, or suggest ideas.</p>
          <a href="https://github.com/beshoi/abbabal-api" target="_blank" rel="noreferrer" class="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
            Get involved <ArrowRight size={11} />
          </a>
        </div>
      </div>
    </div>
  </section>
</div>
