<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
 import DashboardSidebar from "$lib/components/dashboard/DashboardSidebar.svelte";
 import * as Avatar from "$lib/components/ui/avatar/index.js";

 let { children }: { children: import("svelte").Snippet } = $props();
</script>
 
<Sidebar.Provider>
 <DashboardSidebar />
 <main class="flex min-h-svh grow flex-col">
 <nav class="flex justify-between border-b py-4 pr-8">
  <Sidebar.Trigger />
  <Avatar.Root>
    <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
    <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
  </nav>
  <div class="flex-1 px-16 py-8">
  <div class="grid gap-8">
  {@render children?.()}
  </div>
  </div>
 </main>
</Sidebar.Provider>
