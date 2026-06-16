<script lang="ts">
  import { HeartHandshake, ShieldCheck, Sparkles } from "@lucide/svelte";

  const values = [
    {
      title: "Respect the source",
      description:
        "We treat oral history as a living archive and work with community reviewers.",
      icon: HeartHandshake,
    },
    {
      title: "Quality first",
      description:
        "Each entry is checked for accuracy, clarity, and trustworthy translations.",
      icon: ShieldCheck,
    },
    {
      title: "Open by default",
      description:
        "Abbabal is free to explore, with clear docs and lightweight access for everyone.",
      icon: Sparkles,
    },
  ];
</script>

<div class="mx-auto max-w-7xl px-4 py-16 text-foreground">
  <section class="mb-16 flex flex-col items-center gap-12 text-center lg:flex-row lg:text-left">
    <div class="max-w-xl flex-1">
      <h1 class="font-serif text-5xl font-bold tracking-tight md:text-7xl">About</h1>
      <div class="my-5 flex items-center justify-center gap-2 lg:justify-start">
        <span class="h-px w-8 bg-primary"></span>
        <span class="text-xs text-primary">*</span>
        <span class="h-px w-8 bg-primary"></span>
      </div>
      <p class="text-muted-foreground mb-4 font-serif text-2xl italic">
        A living archive of Amharic wisdom.
      </p>
      <p class="text-muted-foreground leading-7">
        Abbabal is a carefully curated collection of Amharic proverbs and their
        meanings, designed to keep cultural wisdom accessible and usable in
        modern products. We focus on accurate translations, reliable metadata,
        and tooling that makes discovery easy.
      </p>
    </div>
    <div class="flex flex-1 justify-center"></div>
  </section>

  <section class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
    <div class="rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
      <p class="text-xs uppercase tracking-[0.3em] text-muted-foreground">Our approach</p>
      <h2 class="mt-3 text-2xl font-semibold">How we build the archive</h2>
      <div class="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          We partner with cultural researchers and community reviewers to gather
          and validate proverbs. Each entry is tagged with region, themes, and
          linguistic nuance, so the archive stays useful for multiple audiences.
        </p>
        <p>
          The API is built with the same care: clear metadata, predictable
          pagination, and stable endpoints so teams can build dependable
          experiences around Abbabal.
        </p>
      </div>
    </div>
    <div class="grid gap-4">
      {#each values as value}
        <div class="flex items-start gap-4 rounded-2xl border border-border bg-muted/40 p-5">
          <div class="text-secondary">
            <value.icon size={22} strokeWidth={1.8} />
          </div>
          <div>
            <h3 class="text-sm font-semibold">{value.title}</h3>
            <p class="text-muted-foreground text-sm leading-6">{value.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
