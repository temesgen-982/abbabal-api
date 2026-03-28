# Design System: Parchment Scribe

### 1. Overview & Creative North Star
**Creative North Star: The Digital Brana**
Parchment Scribe is a design system that marries ancient manuscript aesthetics with high-performance API tooling. It rejects the sterility of modern "SaaS blue" in favor of a warm, tactile, and editorial experience. The system is built on the concept of "The Digital Brana" (traditional Ethiopian vellum), using texture, intentional asymmetry, and deep crimson accents to create a sense of historical gravity and scholarly focus. It breaks the traditional grid through "stacked sheet" effects and decorative "Haräg" patterns.

### 2. Colors
The palette is dominated by **Vivid Red (#a8211a)** and **Gold (#D4AF37)**, set against a rich background of **Creamy Ivory (#F5F0E1)**.

- **The "No-Line" Rule:** Sectioning is achieved through color blocks (Surface to Surface-Container-High) and noise-textured backgrounds. 1px solid black borders are forbidden; use `outline-variant` or subtle shifts in ivory tones to define boundaries.
- **Surface Hierarchy & Nesting:** Use `surface_container` (#f4efe4) for sidebars and `surface_container_high` (#efe8db) for nested input groups. This creates a tactile, physical layering effect like sheets of stacked paper.
- **Signature Textures:** A 0.08 opacity fractal noise filter is applied to the main background. Use a "shimmer" gradient effect on primary CTAs to imply a metallic, gold-leaf quality.

### 3. Typography
The system uses **Work Sans** as the primary engine, paired with **Noto Sans Ethiopic** for cultural depth and character.

- **Display & Headline:** The scale utilizes a dramatic 400px background glyph for atmospheric branding, with Display levels at 60px (3.75rem) to 36px (2.25rem).
- **Body & Labels:** Standard body text sits at 18px (1.125rem) or 16px (1rem) for better legibility against textured backgrounds. Labels use a strict 12px (0.75rem) uppercase with wide letter-spacing (0.2em) to mimic architectural notation.
- **Monospace:** Technical outputs use a specialized "Scribe's Mono" (Courier) for a typewriter-on-vellum feel.

### 4. Elevation & Depth
Depth is not communicated through height, but through **Tonal Layering** and physical metaphors.

- **The Layering Principle:** Components like the "Wisdom Card" utilize multiple offset background divs (rotated -1° and 2°) in varying container tones to simulate a stack of loose-leaf parchment.
- **Ambient Shadows:** Shadows are complex and "inky." Use `2px 3px 10px rgba(0, 0, 0, 0.15)` paired with a `1px` inset ring of the primary color at 10% opacity to ground elements into the parchment.
- **Deckled Edges:** Floating elements should utilize a "deckled edge" effect—a combination of subtle masking and inner glows that suggest hand-torn paper.

### 5. Components
- **Primary Buttons:** High-contrast Crimson with a bottom-heavy 4px border-darkening to simulate a physical button. Features a gold-leaf "shimmer" on hover.
- **Input Fields:** These use "Scribe" styling—heavy 2px borders for selectors or simple bottom-only borders for text entries, emphasizing a handwriting-on-lines feel.
- **Toggles:** Use the "Bead & Thread" metaphor, with a pill-shaped track and a smooth, circular thumb.
- **Decorative Borders (Haräg):** Use the Haräg pattern (African beads) as a container separator or header ornament to ground the interface in its cultural heritage.

### 6. Do's and Don'ts
**Do:**
- Use asymmetry and slight rotations (1-2 degrees) for decorative cards.
- Apply the noise texture to all major surface areas.
- Use wide tracking on all uppercase labels.
- Mix Ethiopic glyphs with Latin text for editorial flair.

**Don't:**
- Use pure #000000 black; use #1a1a1a (Ink) instead.
- Use standard Material "Elevation 1-24" shadows; stick to the custom "Parchment" shadow recipe.
- Use bright blue for links; use the primary red with a bottom-border hover state.
- Over-round corners; maintain a crisp 4px-8px radius to feel "hand-cut."