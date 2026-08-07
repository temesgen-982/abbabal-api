import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { PageLoad } from "./$types";

type Proverb = {
  id: number;
  text: string;
  date: string;
  views: number;
  forwards: number;
  source: string;
  created_at: string;
};

type ProverbsResponse = {
  page: number;
  limit: number;
  total: number;
  results: Proverb[];
};

export const load: PageLoad = async ({ fetch, url }) => {
  const base = (PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const search = url.searchParams.get("search") || url.searchParams.get("q") || "";
  const page = url.searchParams.get("page") || "1";

  try {
    let proverbsData: ProverbsResponse | null = null;

    if (search) {
      const res = await fetch(`${base}/proverbs/search?q=${encodeURIComponent(search)}&limit=20`);
      if (res.ok) {
        const results = await res.json();
        proverbsData = { page: 1, limit: 20, total: results.length, results };
      }
    } else {
      const res = await fetch(`${base}/proverbs?page=${page}&limit=20`);
      if (res.ok) {
        proverbsData = await res.json();
      }
    }

    const statsRes = await fetch(`${base}/stats`).catch(() => null);
    const stats = statsRes?.ok ? await statsRes.json() : null;

    return {
      proverbs: proverbsData?.results ?? [],
      total: proverbsData?.total ?? 0,
      page: proverbsData?.page ?? 1,
      limit: proverbsData?.limit ?? 20,
      searchQuery: search,
      proverbCount: stats?.proverbs ?? null,
    };
  } catch {
    return {
      proverbs: [],
      total: 0,
      page: 1,
      limit: 20,
      searchQuery: "",
      proverbCount: null,
    };
  }
};
