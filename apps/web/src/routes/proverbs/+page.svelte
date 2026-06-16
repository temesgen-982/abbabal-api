<script lang="ts">
	import {
		Bookmark,
		Heart,
		Search,
		Shuffle,
		SlidersHorizontal,
	} from "@lucide/svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";
	import { Input } from "$lib/components/ui/input";

	import type { PageData } from "./$types";

	const proverbs = [
		{
			id: 1,
			text: "Half of strength is the mouth.",
			amharic: "የጉልበት ግማሽ አፍ ነው",
			tag: "Wisdom",
			likes: "142",
			saves: "3.2k",
		},
		{
			id: 2,
			text: "As you sow, so shall you reap.",
			amharic: "እርሻ የተከለ እርሻ ይመዝራል",
			tag: "Life",
			likes: "98",
			saves: "2.6k",
		},
		{
			id: 3,
			text: "True strength is not in the body but in the mind.",
			amharic: "እውነተኛ ብርታት በአካል አይደለም በልብ ነው",
			tag: "Wisdom",
			likes: "87",
			saves: "2.1k",
		},
		{
			id: 4,
			text: "Adversity reveals one's strength.",
			amharic: "መከራ የሰውን ብርታት ያሳያል",
			tag: "Life",
			likes: "76",
			saves: "1.9k",
		},
	];

	let { data }: { data: PageData } = $props();

	const randomAmharic = $derived.by(() => data.randomProverb?.text ?? "");
	const randomEnglish = $derived.by(() => {
		const interpretations = data.randomProverb?.interpretations ?? [];
		const translation = interpretations.find(
			(item) => item.type === "translation" && item.language === "en",
		);
		const meaning = interpretations.find(
			(item) => item.type === "meaning" && item.language === "en",
		);
		return translation?.content || meaning?.content || "";
	});
</script>

<main class="text-foreground">
	<div class="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16">
		<section class="flex flex-col gap-8">
			<div class="flex flex-col gap-3">
				<h1 class="font-serif text-5xl font-bold tracking-tight">Proverbs</h1>
				<p class="text-muted-foreground text-sm">Explore timeless Amharic wisdom.</p>
			</div>

			<div class="flex flex-col gap-3 lg:flex-row lg:items-center">
				<div class="relative flex-1">
					<Search class="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" size={16} />
					<Input
						placeholder="Search proverbs in Amharic or English..."
						class="bg-card/80 pl-9"
					/>
				</div>
				<div class="flex flex-wrap items-center gap-3">
					<Button variant="outline" class="gap-2">
						<Shuffle size={16} />
						Random
					</Button>
					<Button variant="outline" class="gap-2">
						<SlidersHorizontal size={16} />
						Filters
					</Button>
				</div>
			</div>
		</section>

		<section class="grid gap-8 lg:grid-cols-[260px_1fr_300px]">
			<aside class="space-y-6">
				<Card class="rounded-2xl border border-border bg-card/80 shadow-sm">
					<CardContent class="p-5">
						<div class="space-y-4">
							<div>
								<p class="text-xs uppercase tracking-[0.3em] text-muted-foreground">
									Language
								</p>
								<div class="mt-3 space-y-2 text-sm">
									<label class="flex items-center gap-2">
										<input type="radio" name="language" checked />
										<span>Amharic</span>
									</label>
									<label class="flex items-center gap-2 text-muted-foreground">
										<input type="radio" name="language" />
										<span>English</span>
									</label>
								</div>
							</div>

							<Button variant="outline" class="w-full">
								Clear all filters
							</Button>
						</div>
					</CardContent>
				</Card>
			</aside>

			<div class="space-y-4">
				<div class="flex items-center justify-between text-sm text-muted-foreground">
					<span>1,248 proverbs found</span>
					<div class="flex items-center gap-2">
						<span>Most relevant</span>
						<span class="rounded-md border border-border px-2 py-1 text-xs">List</span>
						<span class="rounded-md border border-border px-2 py-1 text-xs">Grid</span>
					</div>
				</div>

				<div class="space-y-4">
					{#each proverbs as proverb}
						<Card class="rounded-2xl border border-border bg-card/80 shadow-sm">
							<CardContent class="flex flex-col gap-4 p-6">
								<div class="flex items-start justify-between">
									<div class="flex items-center gap-3">
										<span class="rounded-xl border border-border px-3 py-1 text-xs font-semibold">
											{proverb.id}
										</span>
										<div>
											<p class="text-sm font-semibold">{proverb.amharic}</p>
											<p class="text-muted-foreground text-sm italic">{proverb.text}</p>
										</div>
									</div>
									<Button variant="ghost" size="icon-sm" aria-label="Save proverb">
										<Bookmark size={16} />
									</Button>
								</div>

								<div class="flex flex-wrap items-center justify-between gap-3">
									<Badge variant="outline" class="text-[0.65rem] uppercase tracking-[0.2em]">
										{proverb.tag}
									</Badge>
									<div class="text-muted-foreground flex items-center gap-4 text-xs">
										<span class="flex items-center gap-1">
											<Heart size={14} />
											{proverb.likes}
										</span>
										<span class="flex items-center gap-1">
											<Bookmark size={14} />
											{proverb.saves}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					{/each}
				</div>
			</div>

			<aside class="space-y-6">
				<Card class="rounded-2xl border border-border bg-card/80 shadow-sm">
					<CardContent class="p-6">
						<div class="flex items-center justify-between">
							<p class="text-xs uppercase tracking-[0.3em] text-muted-foreground">
								Random wisdom
							</p>
							<Shuffle size={16} class="text-primary" />
						</div>

							<div class="mt-6 space-y-4 text-center">
								<div class="mx-auto h-24 w-24 rounded-full bg-primary/10"></div>
								{#if data.randomProverb}
									<p class="text-sm font-semibold">{randomAmharic}</p>
									{#if randomEnglish}
										<p class="text-muted-foreground text-sm italic">{randomEnglish}</p>
									{/if}
								{:else}
									<p class="text-sm font-semibold">No wisdom yet.</p>
									<p class="text-muted-foreground text-sm italic">
										Unable to load a random proverb right now.
									</p>
								{/if}
							</div>

						<Button class="mt-6 w-full gap-2">
							<Shuffle size={16} />
							Show another
						</Button>
					</CardContent>
				</Card>

				<Card class="rounded-2xl border border-border bg-card/80 shadow-sm">
					<CardContent class="p-6">
						<p class="text-sm font-semibold">Save your favorites</p>
						<p class="text-muted-foreground mt-2 text-sm leading-6">
							Create an account or sign in to save and organize your favorites.
						</p>
						<Button variant="outline" class="mt-4 w-full">Sign in / Sign up</Button>
					</CardContent>
				</Card>
			</aside>
		</section>
	</div>
</main>
