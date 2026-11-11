/** What a one-time cleaning usually runs, for the /book page.
 *
 *  Not a quote. Rinse charges by the exact square foot and the condition (a very mossy
 *  roof can take more than one treatment), and nobody has seen the house yet (Bri,
 *  2026-11-10). So this gives an honest idea: the same per-job prices the /plan
 *  calculator uses for "booked one at a time", at the house's real square footage, from
 *  an easy house (flat, all sides open, truck in the driveway) to a harder one (some
 *  slope, a side closed in, a long hose run). The text assistant's price guide
 *  (~/tools/rinse-it-off-ghl/homeowner_bot.py) is the same numbers in bands. */
import { includedWindows, priceHouse, type Stories } from "@/app/plan/pricing";

export type ServiceKey = "roof-moss" | "house-wash" | "gutters" | "driveway" | "windows" | "deck-fence" | "other";

export const SERVICES: { key: ServiceKey; label: string; line?: string }[] = [
  { key: "roof-moss", label: "Roof moss", line: "roof" },
  { key: "house-wash", label: "House wash (siding)", line: "siding" },
  { key: "gutters", label: "Gutters", line: "gutters" },
  { key: "driveway", label: "Driveway and walkways", line: "driveway" },
  { key: "windows", label: "Windows (outside)", line: "windows" },
  { key: "deck-fence", label: "Deck or fence" },
  { key: "other", label: "Something else" },
];

const BASE = { address: "", roof: "composition", driveway: "typical", slope: "flat", sides: "all", parking: "close" } as const;
const round25 = (n: number) => Math.round(n / 25) * 25;

/** Each service's one-visit price at this size, keyed by service. */
function linePrices(sqft: number, stories: Stories, harder: boolean): Partial<Record<ServiceKey, number>> {
  const p = priceHouse({
    ...BASE,
    livingSqft: sqft,
    stories,
    windows: includedWindows(sqft),
    ...(harder ? { slope: "some", sides: "most", parking: "far" } : {}),
  } as Parameters<typeof priceHouse>[0]);
  const byLine = Object.fromEntries(p.lines.map((l) => [l.key, l.amount * p.accessMultiplier]));
  const out: Partial<Record<ServiceKey, number>> = {};
  for (const s of SERVICES) {
    if (s.line === "windows") out[s.key] = p.windowsPerVisitValue;
    else if (s.line && byLine[s.line] !== undefined) out[s.key] = byLine[s.line];
  }
  return out;
}

export interface Estimate {
  lines: { key: ServiceKey; label: string; low: number; high: number }[];
  low: number;
  high: number;
  unpriced: string[]; // picked services we can't put a number on before seeing them
}

/** Null when there's nothing to price (no size, 4+ stories, or only unpriced services). */
export function estimate(sqft: number | null, stories: Stories | null, picked: ServiceKey[]): Estimate | null {
  if (!sqft || !stories || stories > 3 || sqft > 6000) return null;
  const a = linePrices(sqft, stories, false);
  const b = linePrices(sqft, stories, true);
  const lines = SERVICES.filter((s) => picked.includes(s.key) && a[s.key] !== undefined).map((s) => {
    const x = a[s.key]!, y = b[s.key]!;
    return { key: s.key, label: s.label, low: round25(Math.min(x, y)), high: round25(Math.max(x, y)) };
  });
  const unpriced = SERVICES.filter((s) => picked.includes(s.key) && a[s.key] === undefined).map((s) => s.label);
  if (!lines.length) return null;
  return { lines, low: lines.reduce((t, l) => t + l.low, 0), high: lines.reduce((t, l) => t + l.high, 0), unpriced };
}

/** The lowest each service runs on the smallest house we price: the "from" on each tile. */
export const FROM: Partial<Record<ServiceKey, number>> = (() => {
  const all = ([1, 2, 3] as Stories[]).map((st) => linePrices(1200, st, false));
  const out: Partial<Record<ServiceKey, number>> = {};
  for (const s of SERVICES) {
    const v = all.map((x) => x[s.key]).filter((n): n is number => n !== undefined);
    if (v.length) out[s.key] = round25(Math.min(...v));
  }
  return out;
})();

/** The one pairing worth suggesting for what's in the cart, if any. */
export function pairing(picked: ServiceKey[]): { key: ServiceKey; why: string } | null {
  const has = (k: ServiceKey) => picked.includes(k);
  if (has("roof-moss") && !has("gutters")) return { key: "gutters", why: "Moss off the roof ends up in the gutters, so most people clear them on the same visit." };
  if (has("gutters") && !has("roof-moss")) return { key: "roof-moss", why: "Roof moss is what fills most gutters. Treating it on the same visit keeps them clear longer." };
  if (has("house-wash") && !has("windows")) return { key: "windows", why: "Siding rinse runs down the glass, so the outside windows are the natural add after a house wash." };
  if (has("driveway") && !has("house-wash")) return { key: "house-wash", why: "With the crew and the water already there, the siding is the usual add to a driveway." };
  return null;
}
