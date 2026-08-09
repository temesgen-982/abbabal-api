<script lang="ts">
  import { page } from '$app/stores';
  import { Sun, Moon, Languages } from '@lucide/svelte';

  let dark = $state(false);

  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
  }

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Proverbs', href: '/proverbs' },
    { label: 'Download', href: '/download' },
    { label: 'About', href: '/about' },
    { label: 'API', href: '/documentation' },
  ];

  function localeHref(path: string) {
    const locale = $page.url.searchParams.get('locale');
    return locale ? `${path}?locale=${locale}` : path;
  }
</script>

<header class="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
  <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <a href={localeHref('/')} class="flex items-center gap-3">
      <img src="/logo.png" alt="Abbabal logo" class="h-8 w-8 rounded-lg object-cover" />
      <div class="leading-tight">
        <div class="text-lg font-bold tracking-tight">Abbabal</div>
        <div class="text-[10px] font-medium text-muted-foreground -mt-0.5">የእውቀት ቃላት</div>
      </div>
    </a>

    <nav class="hidden items-center gap-8 md:flex">
      {#each navItems as item}
        <a
          href={localeHref(item.href)}
          class="text-sm font-medium transition-colors {$page.url.pathname === item.href ? 'text-foreground font-semibold border-b-2 border-foreground pb-0.5' : 'text-muted-foreground hover:text-foreground'}"
        >
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-3">
      <a
        href="{$page.url.pathname}{$page.url.searchParams.get('locale') === 'am' ? '' : '?locale=am'}"
        class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Switch language"
      >
        <Languages size={16} />
      </a>
      <button
        onclick={toggleTheme}
        class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        aria-label="Toggle theme"
      >
        {#if dark}
          <Sun size={16} />
        {:else}
          <Moon size={16} />
        {/if}
      </button>
    </div>
  </div>
</header>
