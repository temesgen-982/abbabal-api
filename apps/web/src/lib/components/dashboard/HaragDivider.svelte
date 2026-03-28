<script lang="ts">
	import { cn } from "$lib/utils.js";

	let { class: className }: { class?: string } = $props();
</script>

<div
	aria-hidden="true"
	class={cn("w-full opacity-30", className)}
	style="background-image: radial-gradient(circle at 2px 2px, #a8211a 2px, transparent 0); background-size: 12px 12px; height: 4px;"
></div>
