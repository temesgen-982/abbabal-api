<script lang="ts">
	import './layout.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/logo.png" />
	<link rel="apple-touch-icon" href="/logo.png" />
</svelte:head>

<Nav />

{@render children()}

<Footer />
