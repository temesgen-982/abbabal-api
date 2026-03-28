<script lang="ts">
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Chart from "$lib/components/ui/chart/index.js";
	import { scaleUtc } from "d3-scale";
	import { curveLinear } from "d3-shape";
	import { LineChart } from "layerchart";

	type UsagePoint = {
		date: Date;
		requests: number;
	};

	let {
		data,
		title = "Request Volume",
		description = "Sample daily request volume while backend usage endpoints are still in progress.",
	}: {
		data: ReadonlyArray<UsagePoint>;
		title?: string;
		description?: string;
	} = $props();

	const chartConfig = {
		requests: { label: "Requests", color: "var(--chart-1)" },
	} satisfies Chart.ChartConfig;

	const startingRequests = $derived(data[0]?.requests ?? 0);
	const endingRequests = $derived(data.at(-1)?.requests ?? 0);
	const trendDifference = $derived(endingRequests - startingRequests);
	const trendDirection = $derived(trendDifference >= 0 ? "up" : "down");
	const trendPercent = $derived(
		startingRequests > 0
			? Math.abs((trendDifference / startingRequests) * 100).toFixed(1)
			: "0.0",
	);
	const chartData = $derived(Array.from(data));
	const rangeLabel = $derived.by(() => {
		if (data.length === 0) {
			return "Sample date range";
		}

		const firstDate = data[0]?.date;
		const lastDate = data.at(-1)?.date;

		if (!firstDate || !lastDate) {
			return "Sample date range";
		}

		const formatter = new Intl.DateTimeFormat("en-US", {
			month: "short",
			day: "numeric",
		});

		return `${formatter.format(firstDate)} - ${formatter.format(lastDate)}`;
	});
</script>

<Card.Root class="grid gap-6">
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig}>
			<LineChart
				data={chartData}
				x="date"
				xScale={scaleUtc()}
				axis="x"
				series={[
					{
						key: "requests",
						label: "Requests",
						color: chartConfig.requests.color,
					},
				]}
				props={{
					spline: { curve: curveLinear, motion: "tween", strokeWidth: 2 },
					xAxis: {
						format: (value: Date) =>
							value.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
					},
					highlight: { points: { r: 4 } },
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</LineChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-start gap-2 text-sm">
			<div class="grid gap-2">
				<div class="flex items-center gap-2 leading-none font-medium">
					Mock trend {trendDirection} by {trendPercent}% across this sample window
					<TrendingUpIcon
						class={`size-4 transition-transform ${
							trendDirection === "down" ? "rotate-180" : ""
						}`}
					/>
				</div>
				<div class="text-muted-foreground flex items-center gap-2 leading-none">
					{rangeLabel}
				</div>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
