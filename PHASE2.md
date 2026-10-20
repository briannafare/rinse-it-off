# Phase 2: real photo shoot (not implemented yet)

Goal: add real photography that keeps the same worker look and feel, shot to match this design system so new photos drop in with zero re-treatment. Until the shoot happens, generated images hold these slots using the prompt templates in `../design-system/retro/round14/gen.py` (the wardrobe and grade sentences there are fixed; keep them word for word).

## Shot list (each fills or upgrades a current slot)
1. **Hero:** 2–3 workers mid-task with a water-fed pole (ladder only at single-story eaves), golden-hour warmth, eye-level or low angle, 3/4-body framing. Upgrades the hero workers slot (`public/brand/retro/hero-home.webp`).
2. **Team/group:** crew by the truck, candid laughing or gearing up. Upgrades the closing truck slot (`final-truck.webp`).
3. **Detail set:** hands guiding the water-fed pole brush, water sheeting on glass, hose/coil, uniform patch close-ups. Fills the detail-crop slots (`glass-detail.webp`).
4. **Before/after window pairs from real jobs.** Supplements the existing real-job photo sections ("Straight off the truck", "The line isn't an effect").

## Casting
People who look like the actual crew: relatable working-age adults, friendly and capable, slightly retro, a real mix of women and men of different races. If models are needed, cast for that look, not agency-polished corporate stock.

## Wardrobe and styling
Matching branded workwear in the spruce teal / cream / ink palette (magenta and sky only as small prop or patch details) (teal chore jackets or tees, cream tees, ink work pants), period-compatible accessories (canvas tool belts, vintage-style caps, work boots). Rinse It Off is the only visible brand; keep smartphones out of frame. Windows are always cleaned with the water-fed pole from the ground, never a squeegee on high glass.

## Treatment
Shoot digital at working distance (3/4 body or wider), then grade every frame to this one sentence: "Bright, clear natural light; neutral whites and light-gray concrete, distinct green foliage and clear blue sky/glass, rich believable color with preserved skin tones, open shadows and crisp local contrast; subtle fine film grain only, no sepia, tobacco tint, amber veil, muddy shadows or all-over faded color cast." (`scripts/print-grade.py` now adds only the fine grain) and present it in the print frame (`.mat`: white mat, ink keyline and hard ink offset).
