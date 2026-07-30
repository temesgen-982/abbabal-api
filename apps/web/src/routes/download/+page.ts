import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const base = (PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
  const res = await fetch(`${base}/stats`).catch(() => null);
  const stats = res?.ok ? await res.json() : null;

  const dbSize = stats?.dbSize
    ? (stats.dbSize / (1024 * 1024)).toFixed(1) + " MB"
    : null;

  const dbUpdatedAt = stats?.dbUpdatedAt
    ? new Date(stats.dbUpdatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const proverbs = stats?.proverbs ?? null;
  const interpretations = stats?.interpretations ?? null;

  return { dbSize, dbUpdatedAt, proverbs, interpretations, baseUrl: base };
};
