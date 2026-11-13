"use server";

/** House size from public county records (Metro RLIS tax lots: Multnomah, Washington,
 *  Clackamas). Free and keyless. Clark County and anything outside the three counties
 *  comes back empty, and the page then asks the homeowner for their own number. */

const RLIS = "https://services2.arcgis.com/McQ0OlIABe29rJJy/arcgis/rest/services/Taxlots_(Public)/FeatureServer/3/query";
// Metro's building outlines: ground area and perimeter, so roof and gutters are measured, not guessed.
const FOOTPRINTS = "https://services2.arcgis.com/McQ0OlIABe29rJJy/arcgis/rest/services/Building_Footprint_Database/FeatureServer/8/query";

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

type Lot = { SITEADDR: string; SITECITY: string; BLDGSQFT: number; rings?: number[][][]; sr?: unknown };

async function query(where: string): Promise<Lot[]> {
  const url = `${RLIS}?where=${encodeURIComponent(where)}&outFields=SITEADDR,SITECITY,BLDGSQFT&returnGeometry=true&f=json&resultRecordCount=10`;
  const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(6000) });
  if (!r.ok) return [];
  const d = (await r.json()) as { spatialReference?: unknown; features?: { attributes: Lot; geometry?: { rings: number[][][] } }[] };
  return (d.features || [])
    .map((f) => ({ ...f.attributes, rings: f.geometry?.rings, sr: d.spatialReference }))
    .filter((a) => a.BLDGSQFT > 0);
}

/** The main building on the lot: the largest outline touching it. */
async function outline(lot: Lot): Promise<{ footprintSf: number; perimeterFt: number } | null> {
  if (!lot.rings) return null;
  try {
    const q = new URLSearchParams({
      geometry: JSON.stringify({ rings: lot.rings, spatialReference: lot.sr }),
      geometryType: "esriGeometryPolygon", spatialRel: "esriSpatialRelIntersects", inSR: JSON.stringify(lot.sr),
      outFields: "Shape__Area,Shape__Length", returnGeometry: "false", f: "json",
    });
    const r = await fetch(FOOTPRINTS, { method: "POST", body: q, cache: "no-store", signal: AbortSignal.timeout(6000) });
    const d = (await r.json()) as { features?: { attributes: { Shape__Area: number; Shape__Length: number } }[] };
    const big = (d.features || []).map((f) => f.attributes).sort((a, b) => b.Shape__Area - a.Shape__Area)[0];
    // ponytail: a building far bigger than the house is a neighbor or an apartment block; fall back to living area
    if (!big || big.Shape__Area < 400 || big.Shape__Area > lot.BLDGSQFT * 2 + 1500) return null;
    return { footprintSf: Math.round(big.Shape__Area), perimeterFt: Math.round(big.Shape__Length) };
  } catch {
    return null;
  }
}

export async function lookupHouse(
  address: string,
): Promise<{ sqft: number; matched: string; footprintSf?: number; perimeterFt?: number } | null> {
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
    return { sqft: Math.round(pick.BLDGSQFT), matched: `${title(pick.SITEADDR)}, ${title(pick.SITECITY || "")}`, ...(await outline(pick)) };
  } catch {
    return null;
  }
}
