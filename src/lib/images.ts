// Local, approved job photos — served from /public/brand/photos (all optimized .webp).
// No Google-Drive / Unsplash / stock hotlinks; nothing over ~300KB.
//
// Real RIO job photos first. The two AI images this map used to point at were
// deleted: a fabricated articulating lift RIO doesn't own (and that doesn't exist),
// and a technician in an invented warehouse rig. Never reintroduce either.
export const IMG = {
  hero:       "/brand/photos/work/surface-cleaner-steam.webp", // real: surface cleaner mid-pass
  parkingLot: "/brand/photos/work/lot-steam-wide.webp",        // real: lot cleaning, wide
  breezeway:  "/brand/photos/hotwater-degrease.webp",          // placeholder: hot-water degrease
  walkway:    "/brand/photos/walkway-split.webp",         // real: clean/dirty split
  patio:      "/brand/photos/patio-umbrellas.webp",            // real: finished patio
  driveway:   "/brand/photos/work/driveway-after.webp",        // real: residential driveway
  curb:       "/brand/photos/work/curb-gleam.webp",            // real: curb detail
  portland:   "/brand/photos/work/clubhouse-entry.webp",       // real: PNW frame
} as const;
