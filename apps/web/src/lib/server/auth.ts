import { dev } from "$app/environment";
import { env } from "$env/dynamic/public";
import type { Cookies, RequestEvent } from "@sveltejs/kit";
import { Role } from "$lib/enums/role.enum";

export const AUTH_COOKIE_NAME = "abbabal_access_token";
export const REFRESH_COOKIE_NAME = "abbabal_refresh_token";
export const API_BASE_URL = (env.PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

export type User = {
	id: number;
	username: string;
	role: Role;
};

export type AuthResponse = {
	accessToken: string;
	refreshToken: string;
	user: User;
};

function normalizeRole(role: unknown): Role | undefined {
	if (typeof role !== "string") return undefined;
	const normalizedRole = role.toLowerCase();
	return (Object.values(Role) as string[]).includes(normalizedRole) ? (normalizedRole as Role) : undefined;
}

export function decodeToken(token: string) {
	const [, payload] = token.split(".");
	if (!payload) return null;

	try {
		const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
		const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, "=");
		const decoded = JSON.parse(Buffer.from(paddedPayload, "base64").toString("utf-8"));

		const role = normalizeRole(decoded.role);
		if (!role) return null;

		return {
			user: {
				id: decoded.sub || decoded.id,
				username: decoded.username || decoded.name,
				role
			} as User,
			exp: decoded.exp ? new Date(decoded.exp * 1000) : null
		};
	} catch {
		return null;
	}
}

export function normalizeAuthResponse(payload: unknown): AuthResponse | undefined {
	if (!payload || typeof payload !== "object") return undefined;

	const candidate = payload as any;
	const role = normalizeRole(candidate.user?.role);

	if (
		typeof candidate.accessToken !== "string" ||
		typeof candidate.refreshToken !== "string" ||
		typeof candidate.user?.id !== "number" ||
		!role
	) {
		return undefined;
	}

	return {
		accessToken: candidate.accessToken,
		refreshToken: candidate.refreshToken,
		user: {
			id: candidate.user.id,
			username: candidate.user.username || candidate.user.name, // Map name to username
			role,
		},
	};
}

export function setAuthCookies(cookies: Cookies, auth: AuthResponse) {
	const accessDecoded = decodeToken(auth.accessToken);
	const refreshDecoded = decodeToken(auth.refreshToken);

	const baseOptions = {
		path: "/",
		httpOnly: true,
		sameSite: "lax" as const,
		secure: !dev
	};

	cookies.set(AUTH_COOKIE_NAME, auth.accessToken, {
		...baseOptions,
		...(accessDecoded?.exp ? { expires: accessDecoded.exp } : {})
	});

	cookies.set(REFRESH_COOKIE_NAME, auth.refreshToken, {
		...baseOptions,
		...(refreshDecoded?.exp ? { expires: refreshDecoded.exp } : {})
	});
}

export function clearAllAuthCookies(cookies: Cookies) {
	cookies.delete(AUTH_COOKIE_NAME, { path: "/" });
	cookies.delete(REFRESH_COOKIE_NAME, { path: "/" });
}

export async function refreshAccessToken(
	fetch: RequestEvent["fetch"],
	refreshToken: string
): Promise<AuthResponse | null> {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: { authorization: `Bearer ${refreshToken}` }
		});

		if (!response.ok) return null;

		const payload = await response.json();
		const decoded = decodeToken(payload.accessToken);
		if (!decoded) return null;

		return {
			accessToken: payload.accessToken,
			refreshToken: payload.refreshToken,
			user: decoded.user
		};
	} catch {
		return null;
	}
}
