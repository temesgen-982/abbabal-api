<script lang="ts">
 import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
 import { Button } from "$lib/components/ui/button/index.js"
</script>

<header class="flex justify-between px-16 py-4 border-b">
    <div>Abbabal API</div>
    <nav>
        <NavigationMenu.Root>
            <NavigationMenu.List>
                <NavigationMenu.Item>
                    <NavigationMenu.Link>Documentation</NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Link>Examples</NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <NavigationMenu.Link>Link</NavigationMenu.Link>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                <NavigationMenu.Link>About</NavigationMenu.Link>
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu.Root>
    </nav>
    <Button>
        <a href="/dashboard/overview">Get Api Key</a>
    </Button>
</header>