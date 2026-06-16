import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { PageLoad } from "./$types";

type Interpretation = {
	id: number;
	proverbId: number;
	type: "translation" | "meaning";
	language: "en" | "am";
	content: string;
};

type Proverb = {
	id: number;
	text: string;
	interpretations: Interpretation[];
};

export const load: PageLoad = async ({ fetch }) => {
	const baseUrl = (PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
	try {
		const response = await fetch(`${baseUrl}/proverbs/random`, {
			headers: { accept: "application/json" },
		});
		if (!response.ok) {
			return { randomProverb: null };
		}

		const randomProverb = (await response.json()) as Proverb;
		return { randomProverb };
	} catch {
		return { randomProverb: null };
	}
};
