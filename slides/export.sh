#!/usr/bin/env bash
# ============================================================
# Abbabal — slide deck exporter
# Renders every slide-*.html to a pixel-perfect PNG using
# headless Chrome. Output size: 1080×1350 per slide (SCALE× for 2x).
#
# Usage:
#   ./export.sh            # exports all slides to ./out (2x = 2160×2700)
#   SCALE=1 ./export.sh    # exact 1080×1350 PNGs
#   SCALE=2 OUT=hi ./export.sh
# ============================================================
set -euo pipefail
cd "$(dirname "$0")"

SCALE="${SCALE:-2}"
OUT="${OUT:-out}"
mkdir -p "$OUT"

CHROME=""
for bin in \
  google-chrome google-chrome-stable chromium chromium-browser chrome \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
  "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"; do
  if command -v "$bin" >/dev/null 2>&1 || [ -x "$bin" ]; then
    CHROME="$bin"
    break
  fi
done

if [ -z "$CHROME" ]; then
  echo "Error: Google Chrome or Chromium not found. Install it and re-run." >&2
  exit 1
fi

count=0
for f in slide-*.html; do
  base="${f%.html}"
  out="$OUT/$base.png"
  echo "→ $out"
  # --virtual-time-budget lets webfonts finish loading before capture
  if ! "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
      --force-device-scale-factor="$SCALE" \
      --window-size=1080,1350 \
      --virtual-time-budget=5000 \
      --screenshot="$out" "$f" >/dev/null 2>&1; then
    "$CHROME" --headless --disable-gpu --hide-scrollbars \
      --force-device-scale-factor="$SCALE" \
      --window-size=1080,1350 \
      --virtual-time-budget=5000 \
      --screenshot="$out" "$f" >/dev/null 2>&1
  fi
  count=$((count + 1))
done

echo
echo "Done. $count slides exported to ./$OUT"
echo "Image size: $((1080 * SCALE)) × $((1350 * SCALE)) px"
