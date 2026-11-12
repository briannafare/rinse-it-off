// Prints the one-time price ranges the text assistant and phone receptionist quote
// (~/tools/rinse-it-off-ghl/homeowner_bot.py, phone_receptionist.py), from the same engine as /book.
// Run from the repo: npx tsx scripts/print-price-guide.mts
import { servicePrice, type Stories, type Moss } from "../src/lib/one-time-estimate";

const BANDS = [["Under 2,000 sq ft", 1200, 2000], ["2,000 to 3,000 sq ft", 2000, 3000], ["3,000 to 4,000 sq ft", 3000, 4000]] as const;
const down = (n: number) => Math.floor(n / 25) * 25;
const up = (n: number) => Math.ceil(n / 25) * 25;
const $ = (n: number) => `$${n.toLocaleString("en-US")}`;
const p = (k: Parameters<typeof servicePrice>[0], sqft: number, stories: Stories, moss: Moss = "patchy") =>
  servicePrice(k, { sqft, stories }, { moss, windows: 0, driveway: "typical" })!;

const words = ["One story", "Two stories", "Three stories"];
for (const s of [1, 2, 3] as Stories[]) {
  const parts = BANDS.map(([label, lo, hi]) => {
    const r = (k: Parameters<typeof servicePrice>[0], ml?: Moss, mh?: Moss) => `${$(down(p(k, lo, s, ml)))} to ${$(up(p(k, hi, s, mh)))}`;
    return `${label}: gutters ${r("gutters")}, roof ${r("roof-moss", "light", "thick")}, house wash ${r("house-wash")}`;
  });
  console.log(`${words[s - 1]}. ${parts.join(". ")}.`);
}
const d = (k: "small" | "large") => servicePrice("driveway", { sqft: 2000, stories: 1 }, { moss: "patchy", windows: 0, driveway: k })!;
console.log(`Driveway and walkways: ${$(d("small"))} to ${$(d("large"))}.`);
