import { redirect, type Handle } from "@sveltejs/kit";
import {
	AUTH_COOKIE_NAME,
	REFRESH_COOKIE_NAME,
	clearAllAuthCookies,
	setAuthCookies,
	getAuthenticatedUser,
	refreshAccessToken,
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
	const accessToken = event.cookies.get(AUTH_COOKIE_NAME);
	const refreshToken = event.cookies.get(REFRESH_COOKIE_NAME);

	event.locals.user = null;

	if (accessToken) {
		const { user, shouldClearCookie } = await getAuthenticatedUser(
			event.fetch,
			accessToken,
		);

		if (user) {
			event.locals.user = user;
		} else if (shouldClearCookie && refreshToken) {
			// Access token failed, let's try refreshing
			const newAuth = await refreshAccessToken(event.fetch, refreshToken);

			if (newAuth) {
				// Success! Set new cookies and update locals
				setAuthCookies(event.cookies, newAuth);
				event.locals.user = {
					id: newAuth.user.id,
					username: newAuth.user.name,
					role: newAuth.user.role
				};
			} else {
				clearAllAuthCookies(event.cookies);
			}
		}
	}else if (refreshToken) {
        // Case where access cookie expired but refresh is still there
        const newAuth = await refreshAccessToken(event.fetch, refreshToken);
        if (newAuth) {
            setAuthCookies(event.cookies, newAuth);
            event.locals.user = { id: newAuth.user.id, username: newAuth.user.name, role: newAuth.user.role };
        }
	}

	const user = event.locals.user;
	const path = event.url.pathname;

	if (!user) {
    	// If a guest tries to access ANY dashboard path (admin or otherwise)
		if (isProtectedPath(path)) {
			throw redirect(303, "/auth/login");
		}
    	// Guests can stay on public paths or /auth/login
    	return resolve(event);
	}

	if (isAuthPath(event.url.pathname) && event.locals.user) {
		throw redirect(303, "/dashboard/overview");
	}

	if (isAdminPath(path) && user?.role !== Role.ADMIN) {
		// if they are logged in but they are not admin
		throw redirect(303, "/dashboard/overview");
	}

	return resolve(event);
};
