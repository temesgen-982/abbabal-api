<script lang="ts">
	import { page } from '$app/state';

	let { roles = [], children } = $props<{
		roles?: string[];
		children?: import('svelte').Snippet;
	}>();
</script>

{#if roles.includes(page.data.user?.role)}
	{@render children?.()}
{/if}
