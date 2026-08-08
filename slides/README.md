# Abbabal — Product Release Slides

A 14-slide product-release deck (4:5 portrait, 1080×1350) built to post on
LinkedIn. Each slide is a standalone, fixed-frame HTML file — no navigation,
no scrolling, no "website" behavior. Open one, screenshot it, done.

## Deck arc

| # | Slide | Theme |
|---|-------|-------|
| 01 | Cover — አባባል · Amharic Proverbs, Engineered | dark |
| 02 | The why — Oral tradition, digitized | light |
| 03 | The living database — Git is the database | light |
| 04 | The loop — From Telegram to your pocket | light |
| 05 | The brain — AI that knows when it's unsure | light |
| 06 | The polish — 3,298 proverbs, zero duplicates | light |
| 07 | The app — The database is the distribution | light |
| 08 | The refresh — One-tap DB sync | light |
| 09 | The build — One monorepo, three products | light |
| 10 | The identity — Amharic is the interface | light |
| 11 | The surprise — The home-screen widget | light |
| 12 | The refactor — The best feature was a deletion | light |
| 13 | The numbers — By the numbers | dark |
| 14 | Closing — ጥበብን ጠብቅ። ባህልን አጋራ። | dark |

## Quick start

**Preview** — open any `slide-*.html` in a browser. Each file renders at
exactly 1080×1350; use browser zoom to fit the screen.

**Export to PNG** (needs Google Chrome or Chromium installed):

```bash
./export.sh            # all 14 slides → ./out/*.png at 2160×2700 (crisp for LinkedIn)
SCALE=1 ./export.sh    # exact 1080×1350
```

## Editing

- **Global look & feel** — edit `slides.css` (colors mirror the app's design
  tokens: `--olive: #596b38`, `--bg-light: #f7f6f2`, `--bg-dark: #1a1d16`).
- **Slide content** — each file is self-contained; just edit the HTML.
- **Drop slides** — delete any `slide-*.html` (then fix the `X / 14` page
  counters in the footers of the remaining files).

## Posting to LinkedIn

1. Run `./export.sh` and upload the 14 PNGs as a **document carousel**
   (LinkedIn renders 4:5 portrait images well in the feed).
2. Suggested caption hook: *"I built an app that commits its own database…"*
3. Keep slide text minimal — the images carry the story.

## Fonts

Plus Jakarta Sans + Noto Sans Ethiopic are loaded from Google Fonts CDN with
system fallbacks. The export script waits for fonts before capturing.
