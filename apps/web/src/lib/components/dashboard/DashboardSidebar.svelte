<script lang="ts">
 import { SquareTerminal, ChartColumn, Key, FileUser } from "@lucide/svelte";
 import * as Sidebar from "$lib/components/ui/sidebar/index.js";
 
 import { useSidebar } from "$lib/components/ui/sidebar/index.js";
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
 
<Sidebar.Root collapsible="icon" class="py-4">
{#if sidebar.state === "expanded"}
<Sidebar.Header>
    <h2>Abbabal API</h2>
</Sidebar.Header>
{/if}
 <Sidebar.Content>
  <Sidebar.Group>
   <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
   <Sidebar.GroupContent>
    <Sidebar.Menu>
     {#each items as item (item.title)}
      <Sidebar.MenuItem>
       <Sidebar.MenuButton>
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
   </Sidebar.GroupContent>
  </Sidebar.Group>
 </Sidebar.Content>
 {#if sidebar.state === "expanded"}
    <Sidebar.Footer>
        <a href="/dashboard">
        Support
        </a>
    </Sidebar.Footer>
 {/if}
</Sidebar.Root>
