<script lang="ts">
 import { SquareTerminal, ChartColumn, Key, FileUser } from "@lucide/svelte";
 import * as Sidebar from "$lib/components/ui/sidebar/index.js";
 
 import { useSidebar } from "$lib/components/ui/sidebar/index.js";

 import { page } from "$app/state";

 const sidebar = useSidebar();
 
 // Menu items.
 const items = [
  {
   title: "Overview",
   url: "/dashboard/overview",
   icon: FileUser,
  },
  {
   title: "Api Keys",
   url: "/dashboard/api-keys",
   icon: Key,
  },
  {
   title: "Usage",
   url: "/dashboard/usage",
   icon: ChartColumn,
  },
  {
   title: "Playground",
   url: "/dashboard/playground",
   icon: SquareTerminal,
  },
 ];
</script>
 
<Sidebar.Root collapsible="icon">
{#if sidebar.state === "expanded"}
<Sidebar.Header class="text-primary text-xl py-4">
    <h2>Abbabal API</h2>
</Sidebar.Header>
{/if}
 <Sidebar.Content>
    <Sidebar.Menu>
     {#each items as item (item.title)}
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
