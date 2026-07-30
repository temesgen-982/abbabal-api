import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { PageLoad } from "./$types";

export interface Interpretation {
  id: number;
  proverbId: number;
  type: "translation" | "meaning";
  language: "en" | "am";
  content: string;
  source: "telegram" | "ai" | "user";
  isApproved: boolean;
}

export interface ProverbStats {
  views: number;
  forwards: number;
}

export interface Proverb {
  id: number;
  text: string;
  source: "telegram" | "user" | "admin_import";
  status: "pending" | "approved" | "rejected";
  date: string;
  createdAt: string;
  interpretations: Interpretation[];
  latestStats: ProverbStats | null;
}

export type ProverbError = "not_found" | "server_error" | "network_error";

type LoadReturn =
  | { proverb: Proverb; error: null; baseUrl: string }
  | { proverb: null; error: ProverbError; baseUrl: string };

export const load: PageLoad = async ({ fetch, params }): Promise<LoadReturn> => {
  const base = (PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const id = params.id;

  if (!id || isNaN(Number(id))) {
    return { proverb: null, error: "not_found", baseUrl: base };
  }

  try {
    const response = await fetch(`${base}/proverbs/${id}`, {
      headers: { accept: "application/json" },
    });

    if (response.status === 404) {
      return { proverb: null, error: "not_found", baseUrl: base };
    }

    if (!response.ok) {
      return { proverb: null, error: "server_error", baseUrl: base };
    }

    const proverb = (await response.json()) as Proverb;
    return { proverb, error: null, baseUrl: base };
  } catch {
    return { proverb: null, error: "network_error", baseUrl: base };
  }
};
