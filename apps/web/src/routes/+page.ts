import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const base = (PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");

  const [statsRes, randomRes] = await Promise.all([
    fetch(`${base}/stats`).catch(() => null),
    fetch(`${base}/proverbs/random`).catch(() => null),
  ]);

  const stats = statsRes?.ok ? await statsRes.json() : null;
  const randomProverb = randomRes?.ok ? await randomRes.json() : null;

  const proverbCount = stats?.proverbs ?? null;
  const dbSize = stats?.dbSize ? (stats.dbSize / (1024 * 1024)).toFixed(1) + " MB" : null;
  const dbUpdatedAt = stats?.dbUpdatedAt
    ? new Date(stats.dbUpdatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return { proverbCount, dbSize, dbUpdatedAt, randomProverb };
};
