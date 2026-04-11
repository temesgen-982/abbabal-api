<script lang="ts">
	import { page } from '$app/state';
	import { Role } from '$lib/enums/role.enum';

	let { roles = [], children } = $props<{
		roles?: Role[];
		children?: import('svelte').Snippet;
	}>();
</script>

{#if roles.includes(page.data.user?.role)}
	{@render children?.()}
{/if}
