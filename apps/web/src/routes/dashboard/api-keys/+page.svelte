<script lang="ts">
	import { KeyRound, ShieldAlert, Trash2 } from "@lucide/svelte";
	import DashboardApiKeyCard from "$lib/components/dashboard/DashboardApiKeyCard.svelte";
	import DashboardInfoCard from "$lib/components/dashboard/DashboardInfoCard.svelte";
	import DashboardPanel from "$lib/components/dashboard/DashboardPanel.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Form from "$lib/components/ui/form/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { formSchema } from "./schema.js";
	import type { ActionData, PageData } from "./$types";
	import { superForm } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";

	type Feedback = {
		tone: "success" | "error";
		message: string;
	};

	type CreateApiKeyPayload = {
		id: number;
		name: string;
		key: string;
		createdAt: string;
	};

	const dateFormatter = new Intl.DateTimeFormat("en-US", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: "Africa/Addis_Ababa",
	});

	let {
		data,
		form: actionData,
	}: {
		data: PageData;
		form: ActionData | null;
	} = $props();

	// svelte-ignore state_referenced_locally
	const form = superForm(data.form, {
		validators: zod4Client(formSchema),
	});

	const { form: formData, enhance } = form;

	const apiKeys = $derived(actionData?.apiKeys ?? data.apiKeys);
	const apiKeysError = $derived(actionData?.apiKeysError ?? data.apiKeysError);
	const createdKey = $derived<CreateApiKeyPayload | null>(
		actionData?.createdKey ?? null,
	);
	const feedback = $derived<Feedback | null>(actionData?.feedback ?? null);
	const activeKeyCount = $derived(apiKeys.filter((apiKey) => apiKey.isActive).length);

	function formatDateTime(value: string | null | undefined) {
		if (!value) {
			return "Never used";
		}

		return dateFormatter.format(new Date(value));
	}

	async function copyCreatedKey(key: string) {
		await navigator.clipboard.writeText(key);
	}
</script>

<section class="grid gap-3">
	<div class="grid gap-2">
		<h1 class="text-3xl">API Keys</h1>
		<p class="text-muted-foreground max-w-2xl">
			Create credentials for your integrations, revoke old ones, and keep track of
			when each key was last used.
		</p>
	</div>
</section>

{#if feedback}
	<p
		class:text-destructive={feedback.tone === "error"}
		class:text-emerald-700={feedback.tone === "success"}
		class="text-sm"
	>
		{feedback.message}
	</p>
{/if}

<div class="grid gap-10 xl:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
	<div class="grid content-start gap-8">
		<div class="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)]">
			<DashboardPanel>
				<Card.Root>
					<Card.Content>
						<form method="POST" use:enhance class="grid gap-6">
							<Form.Field {form} name="name">
								<Form.Control>
									{#snippet children({ props })}
										<Form.Label>Key Name</Form.Label>
										<Input {...props} bind:value={$formData.name} variant="underline" placeholder="Production" class="p-2" />
									{/snippet}
								</Form.Control>
								<Form.Description>
									Use a short label like `Production`, `Staging`, or `Analytics Job`.
								</Form.Description>
								<Form.FieldErrors />
							</Form.Field>

							<Form.Button class="w-full justify-center">
								<KeyRound />
								Generate Key
							</Form.Button>
						</form>
					</Card.Content>
				</Card.Root>
			</DashboardPanel>

			<DashboardInfoCard class="h-full" title="Key Security Tip">
				{#snippet action()}
					<ShieldAlert class="text-muted-foreground size-4" />
				{/snippet}
				<p class="text-sm leading-6">
					Keep API keys in server-side environment variables and rotate them when a
					service or teammate no longer needs access.
				</p>
			</DashboardInfoCard>
		</div>

		{#if createdKey}
			<DashboardPanel>
				<DashboardApiKeyCard
					title={createdKey.name}
					value={createdKey.key}
					oncopy={() => copyCreatedKey(createdKey.key)}
				/>
				<p class="text-muted-foreground text-sm">
					Store this key somewhere safe now. You will not be able to view the raw
					value again after this response.
				</p>
			</DashboardPanel>
		{/if}

	</div>

	<DashboardPanel>
		{#if apiKeysError}
			<Card.Root>
				<Card.Content class="text-destructive text-sm">{apiKeysError}</Card.Content>
			</Card.Root>
		{:else if apiKeys.length === 0}
			<Card.Root>
				<Card.Content class="grid gap-2">
					<p class="font-medium">No API keys yet</p>
					<p class="text-muted-foreground text-sm">
						Create your first key to start authenticating requests from your apps or
						services.
					</p>
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="grid gap-4">
				{#each apiKeys as apiKey (apiKey.id)}
					<Card.Root>
						<Card.Content class="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
							<div class="grid gap-4">
								<div class="flex flex-wrap items-center gap-3">
									<p class="font-medium">{apiKey.name}</p>
									<span
										class:bg-emerald-100={apiKey.isActive}
										class:text-emerald-700={apiKey.isActive}
										class:bg-muted={!apiKey.isActive}
										class:text-muted-foreground={!apiKey.isActive}
										class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
									>
										{apiKey.isActive ? "Active" : "Revoked"}
									</span>
								</div>

								<div class="text-muted-foreground grid gap-1 text-sm">
									<p>Created {formatDateTime(apiKey.createdAt)}</p>
									<p>Last used {formatDateTime(apiKey.lastUsedAt)}</p>
								</div>
							</div>

							<form method="POST" action="?/revoke">
								<input type="hidden" name="id" value={apiKey.id} />
								<Button
									type="submit"
									variant="destructive"
									size="sm"
									disabled={!apiKey.isActive}
								>
									<Trash2 />
									{apiKey.isActive ? "Revoke" : "Revoked"}
								</Button>
							</form>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		{/if}
	</DashboardPanel>
</div>
