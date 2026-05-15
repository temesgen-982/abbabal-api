import {
	API_BASE_URL,
	normalizeAuthResponse,
	setAuthCookies,
} from "$lib/server/auth.js";
import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema.js";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod4(formSchema)),
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(formSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const registerResponse = await event.fetch(`${API_BASE_URL}/auth/register`, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(form.data),
			});

			if (registerResponse.status === 409) {
				return fail(409, { form, authError: "Username already taken." });
			}

			if (!registerResponse.ok) {
				return fail(registerResponse.status, {
					form,
					authError: "Unable to sign you up right now. Please try again.",
				});
			}

			const payload = await registerResponse.json();
			const normalizedAuth = normalizeAuthResponse(payload);

			if (!normalizedAuth) {
				return fail(502, {
					form,
					authError: "Registration succeeded, but the user data was invalid.",
				});
			}

			setAuthCookies(event.cookies, normalizedAuth);
		} catch {
			return fail(503, {
				form,
				authError: "Unable to reach the registration service. Please try again.",
			});
		}

		throw redirect(303, "/dashboard/overview");
	},
};
