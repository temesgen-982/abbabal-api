export type ProverbRow = {
  id: number;
  text: string;
  date: string;
  views: number;
  forwards: number;
  source: string;
  scrapedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type InterpretationRow = {
  id: number;
  proverbId: number;
  type: string;
  language: string;
  content: string;
  model: string | null;
  confidence: number | null;
  needsReview: number;
  createdAt: string | null;
  updatedAt: string | null;
};
