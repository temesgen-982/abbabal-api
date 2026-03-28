import { API_BASE_URL } from "$lib/server/auth.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { RequestEvent } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import type { SuperValidated } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema.js";

type ApiKeyListItem = {
	id: number;
	name: string;
	isActive: boolean;
	lastUsedAt: string | null;
	createdAt: string;
	updatedAt: string;
};

type CreateApiKeyResponse = {
	id: number;
	name: string;
	key: string;
	createdAt: string;
};

type RevokedApiKeyResponse = {
	id: number;
	name: string;
	isActive: boolean;
};

type Feedback = {
	tone: "success" | "error";
	message: string;
};

type ApiKeysResult = {
	apiKeys: ApiKeyListItem[];
	apiKeysError: string | null;
};

function isRedirectLike(error: unknown): error is { status: number; location: string } {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		"location" in error
	);
}

function requireAuthToken(authToken: string | null) {
	if (!authToken) {
		throw redirect(303, "/auth/login");
	}

	return authToken;
}

async function requestWithAuth(
	fetch: RequestEvent["fetch"],
	authToken: string,
	path: string,
	init: RequestInit = {},
) {
	const headers = new Headers(init.headers);

	headers.set("authorization", `Bearer ${authToken}`);

	const response = await fetch(`${API_BASE_URL}${path}`, {
		...init,
		headers,
	});

	if (response.status === 401 || response.status === 403) {
		throw redirect(303, "/auth/login");
	}

	return response;
}

async function loadApiKeys(
	fetch: RequestEvent["fetch"],
	authToken: string,
): Promise<ApiKeysResult> {
	let response: Response;

	try {
		response = await requestWithAuth(fetch, authToken, "/api-keys");
	} catch (error) {
		if (isRedirectLike(error)) {
			throw error;
		}

		return {
			apiKeys: [],
			apiKeysError: "Unable to reach the API key service right now.",
		};
	}

	if (!response.ok) {
		return {
			apiKeys: [],
			apiKeysError: "Unable to load your API keys right now.",
		};
	}

	return {
		apiKeys: (await response.json()) as ApiKeyListItem[],
		apiKeysError: null,
	};
}

function actionFailure(
	status: number,
	form: SuperValidated<Record<string, unknown>>,
	apiKeysResult: ApiKeysResult,
	feedback: Feedback,
) {
	return fail(status, {
		form,
		...apiKeysResult,
		createdKey: null,
		feedback,
	});
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const authToken = requireAuthToken(locals.authToken);

	return {
		form: await superValidate(zod4(formSchema)),
		...(await loadApiKeys(fetch, authToken)),
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(formSchema));
		const authToken = requireAuthToken(event.locals.authToken);
		const existingKeys = await loadApiKeys(event.fetch, authToken);

		if (!form.valid) {
			return actionFailure(400, form, existingKeys, {
				tone: "error",
				message: "Please fix the highlighted field and try again.",
			});
		}

		const headers = new Headers({
			"content-type": "application/json",
		});

		let response: Response;

		try {
			response = await requestWithAuth(event.fetch, authToken, "/api-keys", {
				method: "POST",
				headers,
				body: JSON.stringify(form.data),
			});
		} catch (error) {
			if (isRedirectLike(error)) {
				throw error;
			}

			return actionFailure(503, form, existingKeys, {
				tone: "error",
				message: "Unable to reach the API key service right now.",
			});
		}

		if (!response.ok) {
			return actionFailure(response.status, form, existingKeys, {
				tone: "error",
				message: "Unable to create a new API key right now.",
			});
		}

		const createdKey = (await response.json()) as CreateApiKeyResponse;
		const refreshedKeys = await loadApiKeys(event.fetch, authToken);

		return {
			form: await superValidate(zod4(formSchema)),
			...refreshedKeys,
			createdKey,
			feedback: {
				tone: "success",
				message: `${createdKey.name} was created. Copy it now because it will not be shown again.`,
			} satisfies Feedback,
		};
	},
	revoke: async (event) => {
		const authToken = requireAuthToken(event.locals.authToken);
		const form = await superValidate(zod4(formSchema));
		const existingKeys = await loadApiKeys(event.fetch, authToken);
		const formData = await event.request.formData();
		const id = Number(formData.get("id"));

		if (!Number.isInteger(id) || id <= 0) {
			return actionFailure(400, form, existingKeys, {
				tone: "error",
				message: "The selected API key could not be revoked.",
			});
		}

		let response: Response;

		try {
			response = await requestWithAuth(event.fetch, authToken, `/api-keys/${id}`, {
				method: "DELETE",
			});
		} catch (error) {
			if (isRedirectLike(error)) {
				throw error;
			}

			return actionFailure(503, form, existingKeys, {
				tone: "error",
				message: "Unable to reach the API key service right now.",
			});
		}

		if (response.status === 404) {
			return actionFailure(404, form, existingKeys, {
				tone: "error",
				message: "That API key was not found.",
			});
		}

		if (!response.ok) {
			return actionFailure(response.status, form, existingKeys, {
				tone: "error",
				message: "Unable to revoke that API key right now.",
			});
		}

		const revokedKey = (await response.json()) as RevokedApiKeyResponse;
		const refreshedKeys = await loadApiKeys(event.fetch, authToken);

		return {
			form,
			...refreshedKeys,
			createdKey: null,
			feedback: {
				tone: "success",
				message: `${revokedKey.name} was revoked.`,
			} satisfies Feedback,
		};
	},
};
