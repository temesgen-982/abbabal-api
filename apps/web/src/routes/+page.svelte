<script lang="ts">
  import Hero from "$lib/components/Hero.svelte";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";
  import { ArrowRight, BookOpenText, Database, Globe2 } from "@lucide/svelte";

  const highlights = [
    {
      title: "Preserved knowledge",
      description:
        "A curated archive of Amharic proverbs, meanings, and context, kept clean and searchable.",
      icon: BookOpenText,
    },
    {
      title: "Developer-ready API",
      description:
        "Simple endpoints with clear rate limits, predictable responses, and generous tooling.",
      icon: Database,
    },
    {
      title: "Global access",
      description:
        "Built for educators, creators, and researchers who need access everywhere.",
      icon: Globe2,
    },
  ];

  const stats = [
    { label: "Proverbs indexed", value: "3,200+" },
    { label: "Total API calls", value: "2.1M+" },
    { label: "Mobile app downloads", value: "5,000+" },
  ];

  const codeSample = `curl https://api.abbabal.com/v1/proverbs \\
  -H "Authorization: Bearer your-key" \\
  -G -d "limit=3" -d "language=am"

{
  "data": [
    {
      "text": "ውሃ ከሞላ በራሱ ይፈሳል",
      "translation": "When water is full...",
      "meaning": "What is abundant...",
      "region": "Addis Ababa"
    }
  ]
}`;

  const faqs = [
    {
      question: "Is Abbabal free to use?",
      answer:
        "Yes. Browsing and most API access are free. Advanced use cases may require an API key.",
    },
    {
      question: "How do you source the proverbs?",
      answer:
        "We compile from verified collections, interviews, and community contributions that are reviewed before publishing.",
    },
    {
      question: "Can I contribute or report corrections?",
      answer:
        "Absolutely. We welcome corrections and new submissions through the documentation portal.",
    },
    {
      question: "Do you offer offline access?",
      answer:
        "Yes. You can download the SQLite database or the mobile app for offline access.",
    },
  ];
</script>

<main class="text-foreground">
  <div class="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-16">
    <Hero
      badge="AMHARIC PROVERB ARCHIVE"
      title="A living archive of Amharic wisdom."
      subtitle="Built for storytellers, teachers, and builders."
      description="Explore thousands of curated Amharic proverbs, their meanings, and cultural context."
    >
      {#snippet children()}
        <div class="rounded-2xl border border-border bg-card/80 p-8 shadow-sm md:p-10">
          <p class="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Proverb of the Day
          </p>
          <blockquote class="font-serif text-2xl font-bold leading-snug md:text-3xl">
            &ldquo;እምቡጥ እስካልቆፈረ አይበቅልም&rdquo;
          </blockquote>
          <div class="mx-auto my-6 h-px w-16 bg-border"></div>
          <p class="text-muted-foreground italic">
            &ldquo;Until the bud is pierced, it does not grow&rdquo;
          </p>
          <p class="text-muted-foreground/60 mt-3 text-xs uppercase tracking-widest">
            &mdash; Amharic Proverb
          </p>
        </div>
      {/snippet}
      {#snippet actions()}
        <Button href="/proverbs" class="gap-2 px-5 py-2.5 font-semibold">
          Explore the archive
          <ArrowRight size={16} />
        </Button>
        <Button href="/auth/signup" variant="outline" class="gap-2 px-5 py-2.5 font-semibold">
          Get API access
        </Button>
      {/snippet}
    </Hero>

    <section class="grid gap-6 sm:grid-cols-3">
      {#each stats as stat}
        <div class="rounded-2xl border border-border bg-card/70 p-5 text-center shadow-sm">
          <p class="text-3xl font-semibold">{stat.value}</p>
          <p class="text-muted-foreground mt-1 text-xs uppercase tracking-[0.2em]">
            {stat.label}
          </p>
        </div>
      {/each}
    </section>

    <section class="grid gap-6 lg:grid-cols-3">
      {#each highlights as item}
        <Card class="rounded-2xl border border-border bg-card/80 shadow-sm">
          <CardContent class="flex h-full flex-col gap-4 p-6">
            <div class="text-primary">
              <item.icon size={24} strokeWidth={1.8} />
            </div>
            <div class="space-y-2">
              <h2 class="text-lg font-semibold">{item.title}</h2>
              <p class="text-muted-foreground text-sm leading-6">{item.description}</p>
            </div>
          </CardContent>
        </Card>
      {/each}
    </section>

    <section class="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-muted-foreground">For developers</p>
        <h2 class="mt-3 text-2xl font-semibold">Simple API, powerful results</h2>
        <p class="text-muted-foreground mt-3 text-sm leading-6">
          Fetch proverbs, search by keyword, or filter by region &mdash; all with a single HTTP
          call. No SDK required, just your API key.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <Button href="/documentation" variant="outline" class="gap-2 px-5 py-2.5 font-semibold">
            Read the docs
          </Button>
          <Button href="/playground" variant="outline" class="gap-2 px-5 py-2.5 font-semibold">
            Try the playground
          </Button>
        </div>
      </div>
      <div class="overflow-hidden rounded-2xl border border-border bg-muted/50 p-5">
        <pre class="overflow-x-auto text-sm leading-6"><code>{codeSample}</code></pre>
      </div>
    </section>

    <section class="rounded-2xl border border-border bg-primary/5 p-6 md:p-8">
      <div class="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-primary">For builders</p>
          <h2 class="mt-2 text-2xl font-semibold">Bring Abbabal into your product</h2>
          <p class="text-muted-foreground mt-2 text-sm leading-6">
            Use the API, embed the daily proverb widget, or download the database for offline
            experiences. We support teams of every size.
          </p>
        </div>
        <Button href="/download" variant="secondary" class="px-5 py-2.5 font-semibold">
          Explore downloads
        </Button>
      </div>
    </section>

    <section class="border-t border-border pt-12">
      <div class="mb-8 flex flex-col gap-3">
        <p class="text-xs uppercase tracking-[0.3em] text-muted-foreground">FAQ</p>
        <h2 class="text-3xl font-semibold">Questions we hear often</h2>
        <p class="text-muted-foreground max-w-2xl text-sm leading-6">
          If you need more detail, reach out through the documentation portal or open an issue.
        </p>
      </div>
      <div class="grid gap-4">
        {#each faqs as faq}
          <details class="rounded-2xl border border-border bg-card/80 p-5">
            <summary class="flex cursor-pointer items-center justify-between gap-4 text-left text-sm font-semibold">
              <span>{faq.question}</span>
              <span class="text-muted-foreground text-xs">+</span>
            </summary>
            <p class="text-muted-foreground mt-3 text-sm leading-6">
              {faq.answer}
            </p>
          </details>
        {/each}
      </div>
    </section>
  </div>
</main>
