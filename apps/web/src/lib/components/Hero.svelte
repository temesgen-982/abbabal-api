<script lang="ts">
  import { Badge } from "$lib/components/ui/badge";
  import type { Snippet } from "svelte";

  let {
    badge = '',
    title = '',
    subtitle = '',
    description = '',
    actions = undefined,
    children = undefined,
    class: className = '',
  }: {
    badge?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    actions?: Snippet;
    children?: Snippet;
    class?: string;
  } = $props();
</script>

<section class="flex flex-col items-center text-center {className}">
  {#if badge}
    <Badge variant="outline" class="mb-4 text-[0.7rem] font-semibold tracking-widest">{badge}</Badge>
  {/if}
  <h1 class="max-w-4xl font-serif text-5xl font-bold tracking-tight md:text-7xl">{title}</h1>
  <div class="my-5 flex items-center justify-center gap-2">
    <span class="h-px w-8 bg-primary"></span>
    <span class="text-xs text-primary">*</span>
    <span class="h-px w-8 bg-primary"></span>
  </div>
  {#if subtitle}
    <p class="text-muted-foreground mb-5 max-w-2xl font-serif text-2xl italic">{subtitle}</p>
  {/if}
  {#if description}
    <p class="text-muted-foreground max-w-3xl leading-7">{description}</p>
  {/if}
  {#if children}
    <div class="mt-12 w-full max-w-xl">
      {@render children()}
    </div>
  {/if}
  {#if actions}
    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      {@render actions()}
    </div>
  {/if}
</section>
