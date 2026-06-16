<script lang="ts">
 import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
 import { buttonVariants } from "$lib/components/ui/button/index.js";

 const navItems = [
   { label: "Documentation", href: "/docs" },
   { label: "Proverbs", href: "/proverbs" },
   { label: "Playground", href: "/playground"},
   { label: "Download", href: "/download" },
   { label: "About", href: "/about" }
 ];
</script>

<header class="flex items-center justify-between px-16 py-4 border-b">
    <div class="font-bold text-xl">Abbabal API</div>
    
    <nav class="relative z-10 flex max-w-max flex-1 items-center justify-center">
        <NavigationMenu.Root>
            <NavigationMenu.List class="group flex flex-1 list-none items-center justify-center space-x-1">
                {#each navItems as item}
                    <NavigationMenu.Item>
                        <NavigationMenu.Link 
                            href={item.href} 
                            class="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                        >
                            {item.label}
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                {/each}
            </NavigationMenu.List>
        </NavigationMenu.Root>
    </nav>

    <a href="/auth/signup" class={buttonVariants({ variant: "default" })}>
        Get Started
    </a>
</header>