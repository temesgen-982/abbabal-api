<script lang="ts">
 import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
 import { Button } from "$lib/components/ui/button/index.js";

 let { onclick }: { onclick?: (event: unknown) => void } = $props();
</script>

<Button variant="ghost" onclick={onclick}>
 Email
 <ArrowUpDownIcon class="ms-2 size-4" />
</Button>
