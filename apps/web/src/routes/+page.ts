import { PUBLIC_API_BASE_URL } from "$env/static/public";
import type { PageLoad } from "./$types";

type Proverb = {
  id: number;
  text: string;
  date: string;
  views: number;
  forwards: number;
  source: string;
  createdAt: string;
  interpretations?: Array<{
    id: number;
    type: string;
    language: string;
    content: string;
  }>;
};

/** Day of year (1–365/366) — used to pick a deterministic proverb of the day. */
function dayOfYear(now = new Date()): number {
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

export const load: PageLoad = async ({ fetch }) => {
  const base = (PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");

  const [statsRes, recentRes, randomRes] = await Promise.all([
    fetch(`${base}/stats`).catch(() => null),
    fetch(`${base}/proverbs?page=1&limit=8`).catch(() => null),
    fetch(`${base}/proverbs/random`).catch(() => null),
  ]);

  const stats = statsRes?.ok ? await statsRes.json() : null;
  const proverbCount = stats?.proverbs ?? null;

  // Proverb of the day — deterministic: day-of-year picks a stable page,
  // then we fetch the detail (with interpretations) for that proverb.
  let potd: Proverb | null = null;
  if (proverbCount) {
    const index = (dayOfYear() - 1) % proverbCount;
    const dailyRes = await fetch(`${base}/proverbs?page=${index + 1}&limit=1`).catch(() => null);
    if (dailyRes?.ok) {
      const dailyList = await dailyRes.json();
      const picked: Proverb | undefined = dailyList?.results?.[0];
      if (picked) {
        const detailRes = await fetch(`${base}/proverbs/${picked.id}`).catch(() => null);
        if (detailRes?.ok) potd = await detailRes.json();
      }
    }
  }
  if (!potd && randomRes?.ok) potd = await randomRes.json();

  // Recently added — API lists newest ids first; sort by createdAt defensively.
  const recentResults: Proverb[] = recentRes?.ok
    ? (await recentRes.json())?.results ?? []
    : [];
  const recent = recentResults
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const dbSize = stats?.dbSize ? (stats.dbSize / (1024 * 1024)).toFixed(1) + " MB" : null;
  const dbUpdatedAt = stats?.dbUpdatedAt
    ? new Date(stats.dbUpdatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return { proverbCount: proverbCount, dbSize, dbUpdatedAt, potd, recent };
};
