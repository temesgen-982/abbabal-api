import { API_BASE_URL, AUTH_COOKIE_NAME } from "$lib/server/auth.js";
import { fail, redirect } from "@sveltejs/kit";
import type { RequestEvent } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema.js";

// --- Types ---
type ApiKeyListItem = { id: number; name: string; isActive: boolean; lastUsedAt: string | null; createdAt: string; updatedAt: string; };
type CreateApiKeyResponse = { id: number; name: string; key: string; createdAt: string; };
type RevokedApiKeyResponse = { id: number; name: string; isActive: boolean; };

// --- Helpers ---

/**
 * Centralized API helper that handles the Bearer token and 401 redirects automatically.
 */
async function apiRequest(event: RequestEvent | { fetch: typeof fetch, cookies: any }, path: string, init?: RequestInit) {
    const token = event.cookies.get(AUTH_COOKIE_NAME);

    const res = await event.fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            ...init?.headers
        }
    });

    if (res.status === 401) throw redirect(303, "/auth/login");
    return res;
}

/**
 * Loads the current list of API keys. Reused by Load and Actions.
 */
function isRedirectLikeError(error: unknown): error is { status: number; location: string } {
    return typeof error === "object"
        && error !== null
        && "status" in error
        && "location" in error
        && typeof (error as { status: unknown }).status === "number"
        && typeof (error as { location: unknown }).location === "string";
}

async function loadApiKeys(event: RequestEvent | { fetch: typeof fetch, cookies: any }) {
    try {
        const res = await apiRequest(event, "/api-keys");
        if (!res.ok) return { apiKeys: [], apiKeysError: "Failed to load keys" };
        const apiKeys = (await res.json()) as ApiKeyListItem[];
        return { apiKeys, apiKeysError: null };
    } catch (error) {
        if (isRedirectLikeError(error)) throw error;
        return { apiKeys: [], apiKeysError: "API service unreachable" };
    }
}

// --- Load Function ---
export const load: PageServerLoad = async (event) => {
    return {
        form: await superValidate(zod4(formSchema)),
        ...(await loadApiKeys(event)),
    };
};

// --- Actions ---
export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event.request, zod4(formSchema));
        
        if (!form.valid) {
            return fail(400, { form, ...(await loadApiKeys(event)) });
        }

        const res = await apiRequest(event, "/api-keys", {
            method: "POST",
            body: JSON.stringify(form.data),
        });

        if (!res.ok) {
            return fail(res.status, { 
                form, 
                ...(await loadApiKeys(event)), 
                feedback: { tone: "error", message: "Failed to create key" } 
            });
        }

        const createdKey = (await res.json()) as CreateApiKeyResponse;
        const refreshedData = await loadApiKeys(event);

        return {
            form: await superValidate(zod4(formSchema)), // Reset form
            ...refreshedData,
            createdKey,
            feedback: { tone: "success", message: `${createdKey.name} created successfully.` }
        };
    },

    revoke: async (event) => {
        const formData = await event.request.formData();
        const rawId = formData.get("id");
        const id = typeof rawId === "string" ? Number(rawId) : NaN;

        if (!Number.isInteger(id) || id <= 0) {
            return fail(400, {
                ...(await loadApiKeys(event)),
                feedback: { tone: "error", message: "Invalid API key id." }
            });
        }
        const res = await apiRequest(event, `/api-keys/${id}`, { method: "DELETE" });

        if (!res.ok) {
            return fail(res.status, { 
                ...(await loadApiKeys(event)), 
                feedback: { tone: "error", message: "Could not revoke key" } 
            });
        }

        const refreshedData = await loadApiKeys(event);
        return {
            ...refreshedData,
            feedback: { tone: "success", message: "Key revoked successfully." }
        };
    },
};
