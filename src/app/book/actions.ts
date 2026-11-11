"use server";

/** House size from public county records (Metro RLIS tax lots: Multnomah, Washington,
 *  Clackamas). Free and keyless. Clark County and anything outside the three counties
 *  comes back empty, and the page then asks the homeowner for their own number. */

const RLIS = "https://services2.arcgis.com/McQ0OlIABe29rJJy/arcgis/rest/services/Taxlots_(Public)/FeatureServer/3/query";

const WORDS: Record<string, string> = {
  NORTH: "N", SOUTH: "S", EAST: "E", WEST: "W", NORTHEAST: "NE", NORTHWEST: "NW", SOUTHEAST: "SE", SOUTHWEST: "SW",
  STREET: "ST", AVENUE: "AVE", AV: "AVE", ROAD: "RD", DRIVE: "DR", COURT: "CT", PLACE: "PL", LANE: "LN",
  BOULEVARD: "BLVD", TERRACE: "TER", CIRCLE: "CIR", PARKWAY: "PKWY", HIGHWAY: "HWY", TRAIL: "TRL", LOOP: "LOOP",
};

/** "16817 Southwest Sunshine Coast Street, Tigard" → { street: "16817 SW SUNSHINE COAST ST", city: "TIGARD" } */
export async function normalize(address: string) {
  const [first, ...rest] = address.toUpperCase().replace(/[.#']/g, "").split(",");
  const street = first
    .replace(/\b(APT|UNIT|STE|SUITE)\b.*$/, "")
    .split(/\s+/).filter(Boolean).map((w) => WORDS[w] ?? w).join(" ");
  const city = (rest[0] || "").trim().replace(/\s+(OR|OREGON)\b.*$/, "").trim();
  return { street, city };
}

type Lot = { SITEADDR: string; SITECITY: string; BLDGSQFT: number };

async function query(where: string): Promise<Lot[]> {
  const url = `${RLIS}?where=${encodeURIComponent(where)}&outFields=SITEADDR,SITECITY,BLDGSQFT&f=json&resultRecordCount=10`;
  const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
  if (!r.ok) return [];
  const d = (await r.json()) as { features?: { attributes: Lot }[] };
  return (d.features || []).map((f) => f.attributes).filter((a) => a.BLDGSQFT > 0);
}

export async function lookupHouse(address: string): Promise<{ sqft: number; matched: string } | null> {
  try {
    const { street, city } = await normalize(address);
    const num = street.match(/^\d+/)?.[0];
    if (!num) return null;
    const q = street.replace(/'/g, "''");
    let lots = await query(`SITEADDR = '${q}'`);
    if (!lots.length) {
      // Retry on the house number + the longest street word, then prefer the city they typed.
      const word = street.split(" ").slice(1).filter((w) => !Object.values(WORDS).includes(w)).sort((a, b) => b.length - a.length)[0];
      if (word) lots = await query(`SITEADDR LIKE '${num} %${word.replace(/'/g, "''")}%'`);
    }
    if (!lots.length) return null;
    const pick = (city && lots.find((l) => l.SITECITY?.toUpperCase() === city)) || (lots.length === 1 ? lots[0] : null);
    if (!pick) return null; // several houses share that street name in different cities: ask instead of guessing
    const title = (s: string) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\b(Ne|Nw|Se|Sw)\b/g, (m) => m.toUpperCase());
    return { sqft: Math.round(pick.BLDGSQFT), matched: `${title(pick.SITEADDR)}, ${title(pick.SITECITY || "")}` };
  } catch {
    return null;
  }
}
