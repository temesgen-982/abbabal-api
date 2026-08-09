<script lang="ts">
  import { Database, ExternalLink, Heart, Send } from '@lucide/svelte';
</script>

<section class="bg-card rounded-2xl border border-border p-5">
  <div class="mb-4 flex items-center gap-2">
    <Database size={16} class="text-primary" />
    <h3 class="text-xs font-bold uppercase tracking-wide text-primary">Data Source</h3>
  </div>

  <div class="flex items-start gap-3">
    <div class="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
      <img src="/telegram-channel-logo.webp" alt="አማርኛ አባባሎች Telegram channel logo" class="h-full w-full object-cover" />
    </div>
    <div>
      <p class="font-ethiopic text-lg font-bold leading-tight">አማርኛ አባባሎች</p>
      <p class="mt-0.5 text-xs font-medium text-muted-foreground">9,000+ subscribers</p>
    </div>
  </div>

  <p class="font-ethiopic mt-3 text-sm leading-relaxed text-muted-foreground">
    ጣፋጭ እና አስተማሪ የአማርኛ አባባሎችን በቀን ሰብስቦ ያቀርባል።
  </p>

  <a
    href="https://t.me/ababaloch"
    target="_blank"
    rel="noreferrer"
    class="mt-4 flex items-center justify-between gap-3 rounded-xl bg-primary/10 px-4 py-3 font-semibold text-primary transition-colors active:scale-[0.99]"
  >
    <span class="flex items-center gap-2.5">
      <Send size={16} />
      t.me/ababaloch
    </span>
    <ExternalLink size={15} />
  </a>

  <p class="mt-4 text-xs leading-relaxed text-muted-foreground">
    Abbabal is built using proverbs collected and shared by the
    <span class="font-ethiopic font-semibold text-foreground">አማርኛ አባባሎች</span>
    Telegram channel. We deeply appreciate their effort in preserving and sharing our cultural wisdom.
    <Heart size={12} class="ml-1 inline-block align-[-1px] text-primary" fill="currentColor" />
  </p>
</section>
