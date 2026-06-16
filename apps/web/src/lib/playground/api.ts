export type PlaygroundEndpoint = "random" | "search" | "list" | "by-id";

export type PlaygroundRequest = {
	endpoint: PlaygroundEndpoint;
	limit?: number;
	page?: number;
	query?: string;
	id?: string;
	apiKey?: string;
};

export type PlaygroundResponse = {
	ok: boolean;
	status: number;
	data: unknown | null;
	latency: number;
	error?: string;
};

function toPositiveInt(value: unknown, fallback: number) {
	const num = typeof value === "string" ? Number(value) : (value as number);
	if (!Number.isFinite(num)) return fallback;
	return Math.max(1, Math.floor(num));
}

export function normalizePlaygroundRequest(input: unknown): PlaygroundRequest {
	const payload = (input ?? {}) as Partial<PlaygroundRequest>;

	return {
		endpoint: (payload.endpoint ?? "random") as PlaygroundEndpoint,
		limit: toPositiveInt(payload.limit, 1),
		page: toPositiveInt(payload.page, 1),
		query: typeof payload.query === "string" ? payload.query : "",
		id: typeof payload.id === "string" ? payload.id : "",
		apiKey: typeof payload.apiKey === "string" ? payload.apiKey : "",
	};
}

export function buildPlaygroundUrl(baseUrl: string, request: PlaygroundRequest) {
	const params = new URLSearchParams();

	if (request.endpoint === "search") {
		params.set("q", (request.query ?? "").trim());
		params.set("limit", String(request.limit ?? 1));
		return `${baseUrl}/proverbs/search?${params.toString()}`;
	}

	if (request.endpoint === "list") {
		params.set("page", String(request.page ?? 1));
		params.set("limit", String(request.limit ?? 1));
		return `${baseUrl}/proverbs?${params.toString()}`;
	}

	if (request.endpoint === "by-id") {
		return `${baseUrl}/proverbs/${encodeURIComponent((request.id ?? "").trim())}`;
	}

	return `${baseUrl}/proverbs/random`;
}

export async function runPlaygroundRequest(
	fetcher: typeof fetch,
	baseUrl: string,
	request: PlaygroundRequest,
): Promise<PlaygroundResponse> {
	const start = performance.now();
	const url = buildPlaygroundUrl(baseUrl, request);
	const headers: Record<string, string> = {
		accept: "application/json",
	};
	if (request.apiKey?.trim()) {
		headers["x-api-key"] = request.apiKey.trim();
	}

	try {
		const res = await fetcher(url, { method: "GET", headers });
		const data = await res.json().catch(() => null);

		return {
			ok: res.ok,
			status: res.status,
			data,
			latency: Math.round(performance.now() - start),
			error: res.ok ? undefined : data?.message || "Request failed.",
		};
	} catch (error) {
		return {
			ok: false,
			status: 503,
			data: null,
			latency: Math.round(performance.now() - start),
			error: error instanceof Error ? error.message : "Network request failed.",
		};
	}
}
