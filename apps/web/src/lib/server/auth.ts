import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import type { Cookies, RequestEvent } from "@sveltejs/kit";

export const AUTH_COOKIE_NAME = "abbabal_access_token";
export const API_BASE_URL = (env.PUBLIC_API_BASE_URL || "http://localhost:3000").replace(
	/\/$/,
	"",
);

export type AuthResponse = {
	accessToken: string;
	user: {
		id: number;
		name: string;
		role: string;
	};
};

export type ProfileResponse = {
	id: number;
	username: string;
	role: string;
};

type AuthLookupResult = {
	user: ProfileResponse | null;
	shouldClearCookie: boolean;
};

export function getTokenExpiry(accessToken: string): Date | undefined {
	const [, payload] = accessToken.split(".");

	if (!payload) {
		return undefined;
	}

	try {
		const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
		const paddedPayload = normalizedPayload.padEnd(
			Math.ceil(normalizedPayload.length / 4) * 4,
			"=",
		);
		const decodedPayload = JSON.parse(
			Buffer.from(paddedPayload, "base64").toString("utf-8"),
		) as { exp?: number };

		if (typeof decodedPayload.exp === "number") {
			return new Date(decodedPayload.exp * 1000);
		}
	} catch {
		return undefined;
	}

	return undefined;
}

export function setAuthCookie(cookies: Cookies, accessToken: string) {
	const tokenExpiry = getTokenExpiry(accessToken);

	cookies.set(AUTH_COOKIE_NAME, accessToken, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: !dev,
		...(tokenExpiry ? { expires: tokenExpiry } : {}),
	});
}

export function clearAuthCookie(cookies: Cookies) {
	cookies.delete(AUTH_COOKIE_NAME, {
		path: "/",
	});
}

export async function getAuthenticatedUser(
	fetch: RequestEvent["fetch"],
	accessToken: string,
): Promise<AuthLookupResult> {
	try {
		const profileResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
			headers: {
				authorization: `Bearer ${accessToken}`,
			},
		});

		if (profileResponse.status === 401 || profileResponse.status === 403) {
			return {
				user: null,
				shouldClearCookie: true,
			};
		}

		if (!profileResponse.ok) {
			return {
				user: null,
				shouldClearCookie: false,
			};
		}

		return {
			user: (await profileResponse.json()) as ProfileResponse,
			shouldClearCookie: false,
		};
	} catch {
		return {
			user: null,
			shouldClearCookie: false,
		};
	}
}
