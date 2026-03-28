<script lang="ts">
	import { onMount } from "svelte";

	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: "Africa/Addis_Ababa",
		year: "numeric",
		month: "short",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});

	let currentTime = $state("");

	onMount(() => {
		const updateTime = () => {
			currentTime = `${formatter.format(new Date())} EAT`;
		};

		updateTime();

		const intervalId = window.setInterval(updateTime, 1000);

		return () => {
			window.clearInterval(intervalId);
		};
	});
</script>

<footer>
	<div class="mx-auto my-4 mt-8 max-w-7xl px-8">
		<div class="flex items-center gap-4 border-t border-primary/10 py-4">
			<span class="font-ethiopic select-none text-4xl text-primary/20">ሀ ሁ ሂ ሃ ሄ ህ ሆ</span>
			<div class="h-[1px] flex-1 bg-primary/10"></div>
			<div class="flex items-center gap-6">
				<p class="text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em]">
					{currentTime}
				</p>
				<div class="flex items-center gap-2">
					<div class="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
					<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
						System Online
					</p>
				</div>
			</div>
		</div>
	</div>
</footer>
