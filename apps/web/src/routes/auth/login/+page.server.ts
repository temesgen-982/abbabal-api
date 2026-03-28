import { API_BASE_URL, setAuthCookie, type AuthResponse } from "$lib/server/auth.js";
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
			return fail(400, {
				form,
			});
		}

		let authResponse: AuthResponse;

		try {
			const loginResponse = await event.fetch(`${API_BASE_URL}/auth/login`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(form.data),
			});

			if (loginResponse.status === 401) {
				return fail(401, {
					form,
					authError: "Invalid username or password.",
				});
			}

			if (!loginResponse.ok) {
				return fail(loginResponse.status, {
					form,
					authError: "Unable to sign you in right now. Please try again.",
				});
			}

			authResponse = (await loginResponse.json()) as AuthResponse;
		} catch {
			return fail(503, {
				form,
				authError: "Unable to reach the login service. Please try again.",
			});
		}

		if (!authResponse.accessToken) {
			return fail(502, {
				form,
				authError: "Login succeeded, but the auth response was incomplete.",
			});
		}

		setAuthCookie(event.cookies, authResponse.accessToken);

		throw redirect(303, "/dashboard/overview");
	},
};
