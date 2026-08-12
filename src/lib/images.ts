// Local, approved job photos — served from /public/brand/photos (all optimized .webp).
// No Google-Drive / Unsplash / stock hotlinks; nothing over ~300KB.
export const IMG = {
  hero:       "/brand/photos/hero-woman.webp",        // hero — operator with wand
  parkingLot: "/brand/photos/surface-cleaning.webp",  // flat surface / lot cleaning
  breezeway:  "/brand/photos/hotwater-degrease.webp", // hot-water degrease, covered walk
  walkway:    "/brand/photos/building-wash.webp",     // building / path wash
  patio:      "/brand/photos/window-purewater.webp",  // pure-water glass + patio
  driveway:   "/brand/photos/roof-softwash.webp",     // soft wash on pitched surface
  curb:       "/brand/photos/masonry-coldwater.webp", // masonry / cold-water curb
  portland:   "/brand/photos/window-purewater.webp",  // atmospheric, light PNW frame
} as const;
