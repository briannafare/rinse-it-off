#!/bin/sh
# Grade the round-14 art and every real job photo with the one print grade, into public/.
# Real photos are graded from their git originals (main), so re-running never double-grades.
set -e
R="../../design-system/retro/round14"; G="python3 scripts/print-grade.py"; D=public/brand/retro
for f in hero-home hero-biz com-hero com-apartments final-truck siding deck patio driveway; do $G $R/$f.png $D/$f.webp 2000; done
$G $R/holiday.png $D/holiday-install.webp 2000
$G $R/glass-detail.png $D/glass-detail.webp 1600
for f in season-spring season-summer season-fall season-winter; do $G --illo $R/$f.png $D/$f.webp 900; done
for f in mi-flatwork mi-siding mi-roof mi-glass mi-grease mi-masonry i-home-wide i-biz-wide; do $G --illo $R/$f.png $D/$f.webp 1600; done
TMP=$(mktemp -d)
for p in work/clubhouse-entry work/driveway-after work/driveway-before work/event-path work/surface-cleaner-steam work/lot-steam-wide work/concrete-closeup work/surface-cleaning-poster work/curb-gleam work/event-floor work/proshop-driveway work/tech-cone walkway-split curb-dramatic before-after-concrete patio-umbrellas walkway-cleaner; do
  f=public/brand/photos/$p.webp
  git show origin/main:$f > $TMP/x.webp 2>/dev/null || cp $f $TMP/x.webp
  $G $TMP/x.webp $f
done
rm -rf $TMP
