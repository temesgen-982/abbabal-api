import { redirect, type Handle } from "@sveltejs/kit";
import {
	AUTH_COOKIE_NAME,
	clearAuthCookie,
	getAuthenticatedUser,
} from "$lib/server/auth.js";
import { Role } from "$lib/enums/role.enum";

function isAdminPath(pathname: string){
	return pathname.startsWith("/dashboard/admin");
}
function isProtectedPath(pathname: string) {
	return pathname.startsWith("/dashboard");
}

function isAuthPath(pathname: string) {
	return pathname === "/auth/login";
}

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get(AUTH_COOKIE_NAME) ?? null;

	event.locals.authToken = null;
	event.locals.user = null;

	if (accessToken) {
		const { user, shouldClearCookie } = await getAuthenticatedUser(
			event.fetch,
			accessToken,
		);

		if (shouldClearCookie) {
			clearAuthCookie(event.cookies);
		}

		if (user) {
			event.locals.authToken = accessToken;
			event.locals.user = user;
		}
	}

	const user = event.locals.user;
	const path = event.url.pathname;

	if (isProtectedPath(path) && !user) {
		throw redirect(303, "/auth/login");
	}

	if (isAdminPath(path) && user?.role !== Role.ADMIN) {
		// if they are logged in but they are not admin
		throw redirect(303, "/dashboard/overview");
	}

	if (isAuthPath(event.url.pathname) && event.locals.user) {
		throw redirect(303, "/dashboard/overview");
	}

	return resolve(event);
};
