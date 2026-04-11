<script lang="ts">
 import { SquareTerminal, ChartColumn, Key, FileUser, Users, BookOpen } from "@lucide/svelte";
 import * as Sidebar from "$lib/components/ui/sidebar/index.js";
 import { useSidebar } from "$lib/components/ui/sidebar/index.js";
 import { page } from "$app/state";
 import { Role } from "$lib/enums/role.enum";
 const sidebar = useSidebar();
 
 const items = [
    // common items
  { title: "Overview", url: "/dashboard/overview", icon: FileUser },
  { title: "Api Keys", url: "/dashboard/api-keys", icon: Key },
  { title: "Usage", url: "/dashboard/usage", icon: ChartColumn },
  { title: "Playground", url: "/dashboard/playground", icon: SquareTerminal },
    // Admin-only items
  { 
    title: "User Management", 
    url: "/dashboard/admin/users", 
    icon: Users, 
    roles: [Role.ADMIN] 
  },
  { 
    title: "Manage Proverbs", 
    url: "/dashboard/admin/proverbs", 
    icon: BookOpen, 
    roles: [Role.ADMIN] 
  },
 ];

 // filter the menu based on the user's role
 const visibleItems = $derived(
  items.filter(item => 
    !item.roles || (!!page.data.user?.role && item.roles.includes(page.data.user.role))
  )
 );
</script>
 
<Sidebar.Root collapsible="icon">
{#if sidebar.state === "expanded"}
<Sidebar.Header class="text-primary text-xl py-4">
    <h2>Abbabal API</h2>
</Sidebar.Header>
{/if}
 <Sidebar.Content>
    <Sidebar.Menu>
     {#each visibleItems as item (item.title)}
      <Sidebar.MenuItem>
       <Sidebar.MenuButton isActive={page.url.pathname === item.url}>
        {#snippet child({ props })}
         <a href={item.url} {...props}>
          <item.icon />
          <span>{item.title}</span>
         </a>
        {/snippet}
       </Sidebar.MenuButton>
      </Sidebar.MenuItem>
     {/each}
    </Sidebar.Menu>
 </Sidebar.Content>
 {#if sidebar.state === "expanded"}
    <Sidebar.Footer>
        <a href="/dashboard">
        Support
        </a>
    </Sidebar.Footer>
 {/if}
</Sidebar.Root>
