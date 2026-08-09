<script lang="ts">
  import { Database, ExternalLink, Heart, Send } from '@lucide/svelte';
</script>

<section>
  <div class="mb-5 flex items-center gap-2.5">
    <Database size={20} class="text-primary" />
    <h3 class="text-sm font-bold uppercase tracking-[0.08em] text-primary">Data Source</h3>
  </div>

  <div class="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7">
    <div class="flex items-start gap-4">
      <div class="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        <img src="/telegram-channel-logo.webp" alt="አማርኛ አባባሎች Telegram channel logo" class="h-full w-full object-cover" />
      </div>
      <div>
        <p class="font-ethiopic text-2xl font-bold leading-tight">አማርኛ አባባሎች</p>
        <p class="mt-1 text-xs font-medium text-muted-foreground">9,000+ subscribers</p>
      </div>
    </div>

    <p class="font-ethiopic mt-4 text-sm leading-relaxed text-muted-foreground">
      ጣፋጭ እና አስተማሪ የአማርኛ አባባሎችን በቀን ሰብስቦ ያቀርባል።
    </p>

    <a
      href="https://t.me/ababaloch"
      target="_blank"
      rel="noreferrer"
      class="mt-5 flex items-center justify-between gap-3 rounded-xl bg-primary/10 px-4 py-3 font-semibold text-primary transition-colors hover:bg-primary/15"
    >
      <span class="flex items-center gap-2.5">
        <Send size={16} />
        t.me/ababaloch
      </span>
      <ExternalLink size={15} />
    </a>

    <p class="mt-5 text-sm leading-relaxed text-muted-foreground">
      Abbabal is built using proverbs collected and shared by the
      <span class="font-ethiopic font-semibold text-foreground">አማርኛ አባባሎች</span>
      Telegram channel. We deeply appreciate their effort in preserving and sharing our cultural wisdom.
      <Heart size={13} class="ml-1 inline-block align-[-2px] text-primary" fill="currentColor" />
    </p>
  </div>
</section>
