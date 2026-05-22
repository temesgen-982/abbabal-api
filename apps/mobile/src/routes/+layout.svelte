<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import { page } from '$app/state';
  import { App } from '@capacitor/app';
  import { goto } from '$app/navigation';
  import { House, Search, Shuffle, Bookmark, User, Menu, X, Info, Star, Send, ArrowLeft } from '@lucide/svelte';

  let { children } = $props();
  let menuOpen = $state(false);
  let menuVisible = $state(false);

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
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-background">

  <!-- Global Header -->
  <div class="sticky top-0 z-20 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
    <!-- Left: menu button or back button -->
    {#if isDetailPage}
      <button
        onclick={() => window.history.back()}
        class="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm"
      >
        <ArrowLeft size={20} />
      </button>
    {:else}
      <button
        onclick={() => openMenu()}
        class="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm"
      >
        <Menu size={20} />
      </button>
    {/if}

    <!-- Center: title -->
    <div class="text-center flex-1 px-2">
      {#if currentPage.subtitle}
        <h1 class="text-2xl font-bold tracking-tight leading-none">{currentPage.title}</h1>
        <p class="text-xs text-primary font-medium mt-0.5">{currentPage.subtitle}</p>
      {:else}
        <h1 class="text-lg font-bold">{currentPage.title}</h1>
      {/if}
    </div>

    <!-- Right: bookmark shortcut -->
    <button
      onclick={() => goto('/saved')}
      class="w-9 h-9 rounded-full bg-card flex items-center justify-center shadow-sm
             {page.url.pathname === '/saved' ? 'text-primary' : 'text-foreground'}"
    >
      <Bookmark size={20} />
    </button>
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
    <div class="flex items-center justify-between px-5 py-4 border-b border-border">
      <div>
        <h2 class="text-xl font-bold">አባባል</h2>
        <p class="text-xs text-primary">Amharic Proverbs</p>
      </div>
      <button
        onclick={closeMenu}
        class="w-9 h-9 rounded-full bg-background flex items-center justify-center"
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

    <!-- Drawer footer -->
    <div class="px-3 py-4 border-t border-border flex flex-col gap-1">
      <a href="/about" onclick={closeMenu} class="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted">
        <Info size={18} />
        About
      </a>
      <a href="/rate" onclick={closeMenu} class="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted">
        <Star size={18} />
        Rate the app
      </a>
      <a href="/feedback" onclick={closeMenu} class="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted">
        <Send size={18} />
        Send feedback
      </a>
    </div>
  </div>
{/if}