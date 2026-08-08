export type ProverbAccent = {
  /** Strong accent — the card's left border and key accents (meta, title bar, links). */
  strong: string;
  /** Soft tint — large decorative elements like the translation quote mark. */
  tint: string;
};

/**
 * Shared card accent palette, cycled across proverb cards on the home,
 * search, and saved pages. Colors match the previous per-card Tailwind
 * classes (primary, amber-700, emerald-700, stone-500).
 */
export const PROVERB_ACCENTS: readonly ProverbAccent[] = [
  { strong: '#596b38', tint: '#c0d3b8' }, // olive (brand primary)
  { strong: '#b45309', tint: '#f3d9b8' }, // amber-700
  { strong: '#047857', tint: '#b7e0d2' }, // emerald-700
  { strong: '#78716c', tint: '#d6d3d1' }, // stone-500
];

/** Picks the accent for a card by list index, cycling through the palette. */
export function accentFor(index: number): ProverbAccent {
  return PROVERB_ACCENTS[index % PROVERB_ACCENTS.length];
}
