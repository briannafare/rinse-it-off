// Real job photos from Rinse It Off projects — served via Google Drive CDN
const gdrive = (id: string, w = 1200) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;

export const IMG = {
  // Job photos — country club commercial project
  hero:       gdrive("101ixwMWFKGIbZ7aRNhLpl13cyBOoQnk4", 1920),  // surface cleaner with steam, green PNW backdrop
  parkingLot: gdrive("1dQTkKBhIIi8SQx8VFYC6KdFiY0KJsVof", 1200),  // wide parking lot with crew + rig + cones
  breezeway:  gdrive("1poxYZHiR2W5NpWpiPWfxcHNzjq7xlA5K", 1200),  // breezeway columns, freshly cleaned concrete
  walkway:    gdrive("11vg0i5mPSizV6lipyJPrUay5HnCdOHL8", 1200),  // clean path with clubhouse + greens
  patio:      gdrive("101-GAwx9ToLCnUZuzuH3X2ex57xzsqqg", 1200),  // patio entrance area mid-clean
  driveway:   gdrive("1-wAWQ4jjA52m0JQYW2nXeRxvyBviPY7J", 1200),  // sweeping curve driveway + clubhouse
  curb:       gdrive("1-ZmSqOAo9tBt05dt0_243yU6tyvd6JU3", 1200),  // low angle curb + blue sky
  // Unsplash — atmospheric only (no service-specific faking)
  portland:   "https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=1920&q=80&auto=format&fit=crop",
} as const;
