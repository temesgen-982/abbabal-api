import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import type { Cookies, RequestEvent } from "@sveltejs/kit";
import { Role } from "$lib/enums/role.enum";

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
		role: Role;
	};
};

export type ProfileResponse = {
	id: number;
	username: string;
	role: Role;
};

type AuthLookupResult = {
	user: ProfileResponse | null;
	shouldClearCookie: boolean;
};

function normalizeRole(role: unknown): Role | undefined {
	if (typeof role !== "string") {
		return undefined;
	}

	const normalizedRole = role.toLowerCase();

	if ((Object.values(Role) as string[]).includes(normalizedRole)) {
		return normalizedRole as Role;
	}

	return undefined;
}

function normalizeProfileResponse(payload: unknown): ProfileResponse | undefined {
	if (!payload || typeof payload !== "object") {
		return undefined;
	}

	const candidate = payload as Partial<ProfileResponse> & {
		role?: unknown;
	};
	const role = normalizeRole(candidate.role);

	if (
		typeof candidate.id !== "number" ||
		typeof candidate.username !== "string" ||
		!role
	) {
		return undefined;
	}

	return {
		id: candidate.id,
		username: candidate.username,
		role,
	};
}

export function normalizeAuthResponse(payload: unknown): AuthResponse | undefined {
	if (!payload || typeof payload !== "object") {
		return undefined;
	}

	const candidate = payload as {
		accessToken?: unknown;
		user?: {
			id?: unknown;
			name?: unknown;
			role?: unknown;
		};
	};
	const role = normalizeRole(candidate.user?.role);

	if (
		typeof candidate.accessToken !== "string" ||
		typeof candidate.user?.id !== "number" ||
		typeof candidate.user?.name !== "string" ||
		!role
	) {
		return undefined;
	}

	return {
		accessToken: candidate.accessToken,
		user: {
			id: candidate.user.id,
			name: candidate.user.name,
			role,
		},
	};
}

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

		const profilePayload = await profileResponse.json();
		const normalizedProfile = normalizeProfileResponse(profilePayload);

		if (!normalizedProfile) {
			return {
				user: null,
				shouldClearCookie: true,
			};
		}

		return {
			user: normalizedProfile,
			shouldClearCookie: false,
		};
	} catch {
		return {
			user: null,
			shouldClearCookie: false,
		};
	}
}
