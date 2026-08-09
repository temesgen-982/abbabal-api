<script lang="ts">
  import './layout.css';
  import { page } from '$app/state';
  import { App } from '@capacitor/app';
  import { goto } from '$app/navigation';
  import { House, Search, Shuffle, Bookmark, User, Menu, X, ArrowLeft, Languages, Sun, Moon } from '@lucide/svelte';
  import { getLocaleState } from '$lib/stores/locale.svelte';

  let { children } = $props();
  let menuOpen = $state(false);
  let menuVisible = $state(false);
  let dark = $state(false);

  const localeState = getLocaleState();

  function initTheme() {
    try {
      const saved = localStorage.getItem('abbabal.theme');
      dark = saved === 'dark';
    } catch {
      // ignore
    }
    document.documentElement.classList.toggle('dark', dark);
  }
  initTheme();

  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('abbabal.theme', dark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }

  function toggleLocale() {
    localeState.set(localeState.value === 'am' ? 'en' : 'am');
  }

  function openMenu() {
    menuOpen = true;
    requestAnimationFrame(() => { menuVisible = true; });
  }

  function closeMenu() {
    menuVisible = false;
    setTimeout(() => { menuOpen = false; }, 300);
  }

  App.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });

  const tabs = [
    { href: '/',        label: 'Home',    icon: House },
    { href: '/search',  label: 'Search',  icon: Search },
    { href: '/random',  label: 'Random',  icon: Shuffle },
    { href: '/saved',   label: 'Saved',   icon: Bookmark },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  const pageTitles: Record<string, { title: string; subtitle?: string }> = {
    '/':               { title: 'አባባል', subtitle: 'Amharic Proverbs' },
    '/search':         { title: 'Search' },
    '/random':         { title: 'Random' },
    '/saved':          { title: 'Saved' },
    '/profile':        { title: 'Profile' },
    '/proverb-detail': { title: 'Proverb' },
  };

  const isDetailPage = $derived(
    page.url.pathname === '/proverb-detail'
  );

  const currentPage = $derived(
    pageTitles[page.url.pathname] ?? { title: 'አባባል' }
  );

  const showBottomNav = $derived(page.url.pathname !== '/proverb-detail');
</script>

<svelte:head>
  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="apple-touch-icon" href="/logo.png" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-background">

  <!-- Global Header -->
  <div class="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between relative">
    <!-- Left: menu button or back button -->
    {#if isDetailPage}
      <button
        onclick={() => window.history.back()}
        class="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>
    {:else}
      <button
        onclick={() => openMenu()}
        class="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>
    {/if}

    <!-- Center: title -->
    <div class="absolute left-1/2 -translate-x-1/2 text-center px-2 pointer-events-none">
      {#if currentPage.subtitle}
        <h1 class="font-ethiopic text-2xl font-bold tracking-tight leading-none">{currentPage.title}</h1>
        <p class="text-xs text-primary font-medium mt-0.5">{currentPage.subtitle}</p>
      {:else}
        <h1 class="text-lg font-bold">{currentPage.title}</h1>
      {/if}
    </div>

    <!-- Right: locale + theme toggles -->
    <div class="flex items-center gap-1.5 ml-auto">
      <button
        onclick={toggleLocale}
        class="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm text-muted-foreground"
        aria-label="Switch language"
      >
        <Languages size={16} />
      </button>
      <button
        onclick={toggleTheme}
        class="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm text-muted-foreground"
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

  <!-- Page content -->
  <main class="flex-1 {showBottomNav ? 'pb-24' : ''}">
    {@render children()}
  </main>

  <!-- Bottom Nav -->
  {#if showBottomNav}
    <nav class="fixed right-4 bottom-4 left-4 z-30 flex h-16 items-stretch overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      {#each tabs as tab (tab.href)}
        {@const active = page.url.pathname === tab.href}
        <a
          href={tab.href}
          class="flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors
                 {active ? 'text-primary' : 'text-muted-foreground'}"
        >
          <tab.icon size={20} />
          <span class="text-[10px] font-medium">{tab.label}</span>
          {#if active}
            <span class="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary"></span>
          {/if}
        </a>
      {/each}
    </nav>
  {/if}
</div>

<!-- Side Menu Overlay -->
{#if menuOpen}
  <!-- Backdrop -->
  <button
    class="fixed inset-0 z-40 transition-opacity duration-300
           {menuVisible ? 'bg-black/40' : 'bg-black/0'}"
    onclick={closeMenu}
    aria-label="Close menu"
  ></button>

  <!-- Drawer -->
  <div
    class="fixed top-0 left-0 bottom-0 z-50 w-72 bg-card flex flex-col shadow-2xl
            transition-transform duration-300 ease-out
            {menuVisible ? 'translate-x-0' : '-translate-x-full'}">
    <!-- Drawer header -->
    <div class="flex items-center gap-3 px-5 py-4 border-b border-border">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-muted">
        <img src="/logo.png" alt="Abbabal logo" class="h-full w-full object-cover" />
      </div>
      <div class="flex-1">
        <h2 class="text-lg font-bold leading-tight tracking-tight">Abbabal</h2>
        <p class="font-ethiopic text-[10px] font-medium text-muted-foreground -mt-0.5">የእውቀት ቃላት</p>
      </div>
      <button
        onclick={closeMenu}
        class="w-9 h-9 rounded-full bg-background flex items-center justify-center text-muted-foreground"
        aria-label="Close menu"
      >
        <X size={18} />
      </button>
    </div>

    <!-- Drawer links -->
    <nav class="flex flex-col px-3 py-4 gap-1 flex-1">
      {#each tabs as tab}
        <a
          href={tab.href}
          onclick={closeMenu}
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                 {page.url.pathname === tab.href
                   ? 'bg-primary/10 text-primary font-medium'
                   : 'text-foreground hover:bg-muted'}"
        >
          <tab.icon size={18} />
          {tab.label}
        </a>
      {/each}
    </nav>
  </div>
{/if}
