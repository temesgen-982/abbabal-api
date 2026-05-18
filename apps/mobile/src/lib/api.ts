const BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL ??
    process.env.PUBLIC_API_BASE_URL ??
    'https://abbabal-api.onrender.com').replace(/\/+$/, '');

export type Interpretation = {
  id: number;
  proverbId: number;
  type: 'translation' | 'meaning';
  language: 'en' | 'am';
  content: string;
  source: 'telegram' | 'ai' | 'user';
  confidence: number | null;
  isApproved: boolean;
  createdAt: string;
};

export type Proverb = {
  id: number;
  text: string;
  date: string;
  createdAt: string;
  interpretations: Interpretation[];
};

export type PaginatedProverbs = {
  page: number;
  limit: number;
  total: number;
  results: Proverb[];
};

async function get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  proverbs: {
    list: (page = 1, limit = 20) =>
      get<PaginatedProverbs>('/proverbs', { page, limit }),
    search: (q: string, limit = 20) =>
      get<Proverb[]>('/proverbs/search', { q, limit }),
    random: () =>
      get<Proverb>('/proverbs/random'),
    findOne: (id: number) =>
      get<Proverb>(`/proverbs/${id}`),
  },
};