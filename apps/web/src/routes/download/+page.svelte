<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Card, CardContent } from "$lib/components/ui/card";

  import {
    ShieldCheck,
    Repeat2,
    BookOpenText,
    HeartPlus,
    Download,
    TabletSmartphone,
    Database,
    SquareCheckBig,
  } from "@lucide/svelte";

  const downloads = [
    {
      title: "SQLite Database",
      description:
        "Get the complete collection of Amharic proverbs in a lightweight SQLite database. Perfect for offline use, research, or integrating into your projects.",
      badge: "OFFLINE ACCESS",
      icon: Database,
      color: {
        soft: "bg-secondary/20",
        strong: "bg-secondary",
        text: "text-secondary",
        border: "border-secondary",
        hover: "hover:bg-secondary/90",
        onStrong: "text-secondary-foreground",
      },
      file: "SQLite (.db)",
      button: "Download DB",
      features: [
        "All proverbs with meanings",
        "Lightweight and fast",
        "Works fully offline",
        "Regular updates",
      ],
    },

    {
      title: "Mobile App",
      description:
        "Get the Abbabal app for a beautiful experience with daily proverbs, search, favorites, and more — all in your pocket.",
      badge: "MOBILE EXPERIENCE",
      icon: TabletSmartphone,
      color: {
        soft: "bg-primary/10",
        strong: "bg-primary",
        text: "text-primary",
        border: "border-primary",
        hover: "hover:bg-primary/90",
        onStrong: "text-primary-foreground",
      },
      file: "Android (.apk)",
      button: "Download App",
      features: [
        "Daily inspiration",
        "Save favorites",
        "Elegant mobile UI",
        "Offline support",
      ],
    },
  ];

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: "Safe & Secure",
      description:
        "Our database is clean, safe, and free from any harmful content.",
    },
    {
      icon: Repeat2,
      title: "Regular Updates",
      description:
        "We update our database regularly to add new proverbs and improve quality.",
    },
    {
      icon: BookOpenText,
      title: "Open & Accessible",
      description:
        "Free to use for everyone. No registration or login required.",
    },
    {
      icon: HeartPlus,
      title: "Support the Project",
      description:
        "Help us preserve our rich heritage.",
    },
  ];
</script>

<div class="mx-auto max-w-7xl px-4 py-16 text-foreground">
  <!-- Hero -->
  <section class="mb-16 flex flex-col items-center gap-12 text-center lg:flex-row lg:text-left">
    <div class="max-w-xl flex-1">
      <h1 class="font-serif text-5xl font-bold tracking-tight md:text-7xl">
        Download
      </h1>

      <div class="my-5 flex items-center justify-center gap-2 lg:justify-start">
        <span class="h-px w-8 bg-primary"></span>
        <span class="text-xs text-primary">◇</span>
        <span class="h-px w-8 bg-primary"></span>
      </div>

      <p class="text-muted-foreground mb-4 font-serif text-2xl italic">
        Take wisdom with you.
      </p>

      <p class="text-muted-foreground leading-7">
        Download our SQLite database to access all Amharic proverbs offline, or
        get the Abbabal mobile app for the best experience anywhere, anytime.
      </p>
    </div>

    <div class="flex flex-1 justify-center"></div>
  </section>

  <!-- Cards -->
  <section class="mb-16 grid gap-6 lg:grid-cols-2">
    {#each downloads as item}
      <Card class="bg-card text-card-foreground overflow-hidden rounded-2xl border border-border shadow-sm">
        <CardContent class="flex h-full flex-col gap-5 p-6">
          <!-- Icon -->
          <div
            class={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${item.color.soft} ${item.color.text}`}
          >
            <item.icon size={30} strokeWidth={1.5} />

            <div
              class={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${item.color.onStrong} ${item.color.strong}`}
            >
              <SquareCheckBig size={11} />
            </div>
          </div>

          <!-- Badge -->
          <Badge
            variant="outline"
            class={`w-fit text-[0.7rem] font-semibold tracking-wider ${item.color.border} ${item.color.text}`}
          >
            {item.badge}
          </Badge>

          <!-- Title -->
          <div class="space-y-2">
            <h2 class="font-serif text-2xl font-bold">
              {item.title}
            </h2>

            <p class="text-muted-foreground text-sm leading-7">
              {item.description}
            </p>
          </div>

          <!-- Features -->
          <ul class="flex flex-1 flex-col gap-3">
            {#each item.features as feature}
              <li class="text-foreground/80 flex items-center gap-3 text-sm">
                <div
                  class={`flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-inset ${item.color.soft} ${item.color.text}`}
                >
                  <SquareCheckBig size={12} strokeWidth={2.5} />
                </div>

                <span>{feature}</span>
              </li>
            {/each}
          </ul>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-2">
            <Button
              class={`gap-2 px-5 py-2.5 font-semibold ${item.color.onStrong} ${item.color.strong} ${item.color.hover}`}
            >
              <Download size={16} />
              {item.button}
            </Button>

            <span class="text-muted-foreground rounded-md border border-border px-3 py-1 text-xs">
              {item.file}
            </span>
          </div>

          <!-- Footer -->
          <div
            class="text-muted-foreground -mx-6 -mb-6 mt-2 flex items-center gap-2 border-t border-border bg-muted/40 px-6 py-3 text-xs"
          >
            <span>ⓘ File size: ~2.4 MB</span>
            <span class="opacity-40">•</span>
            <span>Updated: May 15, 2024</span>
            <span class="opacity-40">•</span>
            <span>Version: 1.0</span>
          </div>
        </CardContent>
      </Card>
    {/each}
  </section>

  <!-- Trust -->
  <section class="grid gap-8 border-t border-border pt-10 md:grid-cols-2 lg:grid-cols-4">
    {#each trustBadges as badge}
      <div class="flex items-start gap-4">
        <div class="mt-0.5 text-primary">
          <badge.icon size={24} strokeWidth={1.8} />
        </div>

        <div>
          <p class="mb-1 text-sm font-bold">{badge.title}</p>
          <p class="text-muted-foreground text-sm leading-6">
            {badge.description}
          </p>
        </div>
      </div>
    {/each}
  </section>
</div>