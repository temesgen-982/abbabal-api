import { redirect, type Handle } from "@sveltejs/kit";
import {
	AUTH_COOKIE_NAME,
	REFRESH_COOKIE_NAME,
	clearAllAuthCookies,
	setAuthCookies,
	decodeToken,
	refreshAccessToken,
} from "$lib/server/auth.js";
import { Role } from "$lib/enums/role.enum";

function isAdminPath(pathname: string) {
	return pathname.startsWith("/dashboard/admin");
}
function isProtectedPath(pathname: string) {
	return pathname.startsWith("/dashboard");
}
function isAuthPath(pathname: string) {
	return pathname === "/auth/login";
}

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get(AUTH_COOKIE_NAME);
	const refreshToken = event.cookies.get(REFRESH_COOKIE_NAME);

	event.locals.user = null;

	// Attempt to get user from Access Token
	if (accessToken) {
		const decoded = decodeToken(accessToken);
		const isExpired = decoded?.exp ? Date.now() >= decoded.exp.getTime() : true;

		if (decoded && !isExpired) {
			event.locals.user = decoded.user;
		}
	}

	// If no user found (missing or expired token), try Refresh Token
	if (!event.locals.user && refreshToken) {
		const newAuth = await refreshAccessToken(event.fetch, refreshToken);
		if (newAuth) {
			setAuthCookies(event.cookies, newAuth);
			event.locals.user = newAuth.user;
		} else {
			// Refresh failed (invalid/expired refresh token), wipe cookies
			clearAllAuthCookies(event.cookies);
		}
	}

	const user = event.locals.user;
	const path = event.url.pathname;

	// Guarding: Redirect Guests
	if (!user) {
		if (isProtectedPath(path)) {
			throw redirect(303, "/auth/login");
		}
		return resolve(event);
	}

	// Guarding: Redirect Auth'd users away from Login
	if (isAuthPath(path)) {
		throw redirect(303, "/dashboard/overview");
	}

	// Guarding: Admin Authorization
	if (isAdminPath(path) && user.role !== Role.ADMIN) {
		throw redirect(303, "/dashboard/overview");
	}

	return resolve(event);
};
