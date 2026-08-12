/** Service-area registry for the low-key local-SEO system (/areas/[slug]).
 *
 *  Neighborhood slugs were harvested from the Lindley Team / HouseLab page
 *  sitemaps ("*-neighborhood" pages), then cleaned — the "-neighborhood",
 *  "-copy", "-2" suffixes stripped, typos normalized ("neigborhood"), and
 *  duplicates removed. RIO metro CITIES lead the list as the strongest pages;
 *  Portland neighborhoods follow.
 *
 *  `nearby` holds 3-4 adjacent slugs for internal linking. Every slug in a
 *  `nearby` array is guaranteed to exist elsewhere in AREAS, so cross-links
 *  never point at a 404. This is NOT wired into the main Navbar — it's a
 *  crawlable service-area layer only. */
export type AreaType = "city" | "neighborhood";

export type Area = {
  slug: string;
  name: string;
  type: AreaType;
  nearby: string[]; // slugs of adjacent areas (all present in AREAS)
};

export const AREAS: Area[] = [
  // ── RIO metro cities — the strongest, highest-intent pages ────────────────
  { slug: "portland", name: "Portland", type: "city", nearby: ["beaverton", "milwaukie", "gresham", "lake-oswego"] },
  { slug: "tigard", name: "Tigard", type: "city", nearby: ["beaverton", "tualatin", "lake-oswego", "portland"] },
  { slug: "beaverton", name: "Beaverton", type: "city", nearby: ["hillsboro", "tigard", "portland", "lake-oswego"] },
  { slug: "lake-oswego", name: "Lake Oswego", type: "city", nearby: ["west-linn", "tualatin", "tigard", "milwaukie"] },
  { slug: "tualatin", name: "Tualatin", type: "city", nearby: ["tigard", "west-linn", "lake-oswego", "beaverton"] },
  { slug: "west-linn", name: "West Linn", type: "city", nearby: ["lake-oswego", "tualatin", "milwaukie", "tigard"] },
  { slug: "hillsboro", name: "Hillsboro", type: "city", nearby: ["beaverton", "tigard", "tualatin", "portland"] },
  { slug: "gresham", name: "Gresham", type: "city", nearby: ["portland", "milwaukie", "hazelwood", "powellhurst-gilbert"] },
  { slug: "milwaukie", name: "Milwaukie", type: "city", nearby: ["portland", "gresham", "sellwood-moreland", "lake-oswego"] },

  // ── Portland neighborhoods ────────────────────────────────────────────────
  // Inner SE / close-in eastside
  { slug: "kerns", name: "Kerns", type: "neighborhood", nearby: ["buckman", "sunnyside", "laurelhurst", "irvington"] },
  { slug: "buckman", name: "Buckman", type: "neighborhood", nearby: ["kerns", "sunnyside", "hosford-abernethy", "laurelhurst"] },
  { slug: "sunnyside", name: "Sunnyside", type: "neighborhood", nearby: ["kerns", "buckman", "laurelhurst", "creston-kenilworth"] },
  { slug: "laurelhurst", name: "Laurelhurst", type: "neighborhood", nearby: ["kerns", "sunnyside", "grant-park", "hollywood"] },
  { slug: "hosford-abernethy", name: "Hosford-Abernethy", type: "neighborhood", nearby: ["buckman", "brooklyn", "sunnyside", "sellwood-moreland"] },
  { slug: "brooklyn", name: "Brooklyn", type: "neighborhood", nearby: ["hosford-abernethy", "creston-kenilworth", "sellwood-moreland", "reed"] },
  { slug: "lloyd", name: "Lloyd", type: "neighborhood", nearby: ["kerns", "irvington", "buckman", "eliot"] },

  // Inner / middle NE
  { slug: "irvington", name: "Irvington", type: "neighborhood", nearby: ["eliot", "king", "sabin", "alameda"] },
  { slug: "eliot", name: "Eliot", type: "neighborhood", nearby: ["irvington", "king", "boise", "humboldt"] },
  { slug: "king", name: "King", type: "neighborhood", nearby: ["eliot", "sabin", "humboldt", "vernon"] },
  { slug: "sabin", name: "Sabin", type: "neighborhood", nearby: ["irvington", "king", "alameda", "vernon"] },
  { slug: "alameda", name: "Alameda", type: "neighborhood", nearby: ["irvington", "sabin", "beaumont-wilshire", "grant-park"] },
  { slug: "vernon", name: "Vernon", type: "neighborhood", nearby: ["king", "sabin", "concordia", "woodlawn"] },
  { slug: "concordia", name: "Concordia", type: "neighborhood", nearby: ["vernon", "alameda", "beaumont-wilshire", "woodlawn"] },
  { slug: "beaumont-wilshire", name: "Beaumont-Wilshire", type: "neighborhood", nearby: ["alameda", "concordia", "grant-park", "roseway"] },
  { slug: "grant-park", name: "Grant Park", type: "neighborhood", nearby: ["laurelhurst", "alameda", "hollywood", "beaumont-wilshire"] },
  { slug: "hollywood", name: "Hollywood", type: "neighborhood", nearby: ["grant-park", "laurelhurst", "roseway", "madison-south"] },
  { slug: "roseway", name: "Roseway", type: "neighborhood", nearby: ["beaumont-wilshire", "hollywood", "madison-south", "woodlawn"] },

  // North Portland
  { slug: "boise", name: "Boise", type: "neighborhood", nearby: ["eliot", "humboldt", "king", "overlook"] },
  { slug: "humboldt", name: "Humboldt", type: "neighborhood", nearby: ["boise", "king", "overlook", "arbor-lodge"] },
  { slug: "overlook", name: "Overlook", type: "neighborhood", nearby: ["boise", "humboldt", "arbor-lodge", "kenton"] },
  { slug: "arbor-lodge", name: "Arbor Lodge", type: "neighborhood", nearby: ["overlook", "kenton", "humboldt", "university-park"] },
  { slug: "kenton", name: "Kenton", type: "neighborhood", nearby: ["arbor-lodge", "overlook", "university-park", "cathedral-park"] },
  { slug: "university-park", name: "University Park", type: "neighborhood", nearby: ["cathedral-park", "kenton", "arbor-lodge", "overlook"] },
  { slug: "cathedral-park", name: "Cathedral Park", type: "neighborhood", nearby: ["university-park", "kenton", "overlook", "arbor-lodge"] },
  { slug: "woodlawn", name: "Woodlawn", type: "neighborhood", nearby: ["vernon", "concordia", "king", "roseway"] },

  // North peninsula / islands
  { slug: "hayden-island", name: "Hayden Island", type: "neighborhood", nearby: ["bridgeton", "sunderland", "east-columbia", "kenton"] },
  { slug: "bridgeton", name: "Bridgeton", type: "neighborhood", nearby: ["hayden-island", "east-columbia", "sunderland", "kenton"] },
  { slug: "east-columbia", name: "East Columbia", type: "neighborhood", nearby: ["bridgeton", "sunderland", "hayden-island", "kenton"] },
  { slug: "sunderland", name: "Sunderland", type: "neighborhood", nearby: ["east-columbia", "bridgeton", "argay", "parkrose"] },

  // NE / outer NE
  { slug: "parkrose", name: "Parkrose", type: "neighborhood", nearby: ["parkrose-heights", "argay", "sunderland", "roseway"] },
  { slug: "parkrose-heights", name: "Parkrose Heights", type: "neighborhood", nearby: ["parkrose", "argay", "madison-south", "roseway"] },
  { slug: "argay", name: "Argay", type: "neighborhood", nearby: ["parkrose", "parkrose-heights", "wilkes", "sunderland"] },
  { slug: "wilkes", name: "Wilkes", type: "neighborhood", nearby: ["argay", "parkrose", "hazelwood", "glenfair"] },
  { slug: "madison-south", name: "Madison South", type: "neighborhood", nearby: ["roseway", "parkrose-heights", "hollywood", "hazelwood"] },

  // East Portland
  { slug: "hazelwood", name: "Hazelwood", type: "neighborhood", nearby: ["glenfair", "wilkes", "madison-south", "mill-park"] },
  { slug: "glenfair", name: "Glenfair", type: "neighborhood", nearby: ["hazelwood", "wilkes", "mill-park", "centennial"] },
  { slug: "mill-park", name: "Mill Park", type: "neighborhood", nearby: ["hazelwood", "glenfair", "centennial", "powellhurst-gilbert"] },
  { slug: "centennial", name: "Centennial", type: "neighborhood", nearby: ["glenfair", "mill-park", "powellhurst-gilbert", "hazelwood"] },
  { slug: "powellhurst-gilbert", name: "Powellhurst-Gilbert", type: "neighborhood", nearby: ["lents", "centennial", "mill-park", "brentwood-darlington"] },

  // SE Portland
  { slug: "creston-kenilworth", name: "Creston-Kenilworth", type: "neighborhood", nearby: ["sunnyside", "brooklyn", "foster-powell", "south-tabor"] },
  { slug: "south-tabor", name: "South Tabor", type: "neighborhood", nearby: ["creston-kenilworth", "foster-powell", "mt-scott-arleta", "woodstock"] },
  { slug: "foster-powell", name: "Foster-Powell", type: "neighborhood", nearby: ["creston-kenilworth", "south-tabor", "mt-scott-arleta", "brentwood-darlington"] },
  { slug: "mt-scott-arleta", name: "Mt. Scott-Arleta", type: "neighborhood", nearby: ["foster-powell", "south-tabor", "brentwood-darlington", "woodstock"] },
  { slug: "woodstock", name: "Woodstock", type: "neighborhood", nearby: ["reed", "eastmoreland", "mt-scott-arleta", "brentwood-darlington"] },
  { slug: "reed", name: "Reed", type: "neighborhood", nearby: ["woodstock", "eastmoreland", "brooklyn", "sellwood-moreland"] },
  { slug: "eastmoreland", name: "Eastmoreland", type: "neighborhood", nearby: ["reed", "woodstock", "sellwood-moreland", "brooklyn"] },
  { slug: "sellwood-moreland", name: "Sellwood-Moreland", type: "neighborhood", nearby: ["eastmoreland", "reed", "brooklyn", "hosford-abernethy"] },
  { slug: "brentwood-darlington", name: "Brentwood-Darlington", type: "neighborhood", nearby: ["mt-scott-arleta", "foster-powell", "woodstock", "lents"] },
  { slug: "lents", name: "Lents", type: "neighborhood", nearby: ["brentwood-darlington", "powellhurst-gilbert", "foster-powell", "mt-scott-arleta"] },

  // SW Portland
  { slug: "hillsdale", name: "Hillsdale", type: "neighborhood", nearby: ["bridlemile", "markham", "ashcreek", "west-portland-park"] },
  { slug: "bridlemile", name: "Bridlemile", type: "neighborhood", nearby: ["hillsdale", "ashcreek", "west-portland-park", "markham"] },
  { slug: "ashcreek", name: "Ashcreek", type: "neighborhood", nearby: ["hillsdale", "markham", "west-portland-park", "arnold-creek"] },
  { slug: "markham", name: "Markham", type: "neighborhood", nearby: ["ashcreek", "hillsdale", "west-portland-park", "arnold-creek"] },
  { slug: "west-portland-park", name: "West Portland Park", type: "neighborhood", nearby: ["markham", "ashcreek", "arnold-creek", "marshall-park"] },
  { slug: "arnold-creek", name: "Arnold Creek", type: "neighborhood", nearby: ["markham", "marshall-park", "ashcreek", "west-portland-park"] },
  { slug: "marshall-park", name: "Marshall Park", type: "neighborhood", nearby: ["arnold-creek", "markham", "west-portland-park", "ashcreek"] },
  { slug: "woodland-park", name: "Woodland Park", type: "neighborhood", nearby: ["hazelwood", "madison-south", "roseway", "glenfair"] },
];

export const CITIES: Area[] = AREAS.filter((a) => a.type === "city");
export const NEIGHBORHOODS: Area[] = AREAS.filter((a) => a.type === "neighborhood");

const AREA_BY_SLUG: Record<string, Area> = Object.fromEntries(
  AREAS.map((a) => [a.slug, a]),
);

/** Look up one area by slug, or undefined for an unknown slug (page → notFound). */
export function getAreaBySlug(slug: string): Area | undefined {
  return AREA_BY_SLUG[slug];
}

/** Resolve an area's `nearby` slugs to full Area records, skipping any miss. */
export function getNearbyAreas(area: Area): Area[] {
  return area.nearby
    .map((s) => AREA_BY_SLUG[s])
    .filter((a): a is Area => Boolean(a));
}
