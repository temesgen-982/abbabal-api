<script lang="ts">
 import BanIcon from "@lucide/svelte/icons/ban";
 import HistoryIcon from "@lucide/svelte/icons/history";
 import PencilIcon from "@lucide/svelte/icons/pencil";
 import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
 import TrashIcon from "@lucide/svelte/icons/trash";
 import { Button } from "$lib/components/ui/button/index.js";
 
 let {
  id,
  status,
 }: {
  id: string;
  status: "active" | "suspended";
 } = $props();
</script>
 
<div class="flex justify-end gap-2">
 <Button
  variant="outline"
  size="icon-sm"
  class="size-8"
  aria-label={`Edit ${id}`}
  title="Edit profile"
 >
  <PencilIcon class="size-4" />
 </Button>

 <Button
  variant="outline"
  size="icon-sm"
  class="size-8"
  aria-label={`View logs for ${id}`}
  title="View logs"
 >
  <HistoryIcon class="size-4" />
 </Button>

 <Button
  variant={status === "active" ? "destructive" : "outline"}
  size="icon-sm"
  class="size-8"
  aria-label={status === "active" ? `Suspend ${id}` : `Reactivate ${id}`}
  title={status === "active" ? "Suspend access" : "Reactivate access"}
 >
  {#if status === "active"}
   <BanIcon class="size-4" />
  {:else}
   <RotateCcwIcon class="size-4" />
  {/if}
 </Button>

 <Button
  variant="destructive"
  size="icon-sm"
  class="size-8"
  aria-label="Delete user"
  title="Delete User"
 >
   <TrashIcon class="size-4" />
 </Button>
</div>