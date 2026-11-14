/** POST /api/quote/analyze — internal audit-tool AI analysis.
 *  Receives compressed photos (base64) + job context, calls the Anthropic
 *  Messages API with the approved pricing prompt, applies the tiered-minimums
 *  logic SERVER-SIDE, and returns the assessment + priced services.
 *  A route handler (not a server action) so the multi-MB photo payload avoids
 *  the 1MB server-action body limit. ANTHROPIC_API_KEY never leaves the server. */

import { NextResponse } from "next/server";
import { isQuoteAuthed } from "@/app/quote/auth";
import { SYSTEM_PROMPT } from "@/app/quote/prompt";
import { applyTieredMinimums } from "@/lib/quote/minimums.mjs";
import type { AnalyzeResponse, Finding, RecommendedService } from "@/lib/quote/types";
import { lookupHouse } from "@/app/book/actions";
import { ADD_ONS } from "@/app/plan/pricing";
import {
  HARD, MOSS_LABEL, ROOF_GUTTER_SHARE, SAME_VISIT_OFF, SERVICES, VISIT_MIN, guessStories, measure, quote, servicePrice,
  type Driveway, type Hard, type Moss, type ServiceKey, type Stories,
} from "@/lib/one-time-estimate";

export const runtime = "nodejs";
export const maxDuration = 300; // analysis takes 30-90s; give it headroom

const ANTHROPIC_MODEL = "claude-sonnet-5";
const MAX_PHOTOS = 20; // the browser also keeps the request under Vercel's 4.5 MB body limit

const ALLOWED_MEDIA = new Set(["image/jpeg", "image/png", "image/webp"]);

interface AnalyzeRequestBody {
  photos: Array<{ data: string; mediaType: string }>;
  propertyType?: string;
  address?: string;
  contactName?: string;
  notes?: string;
}

export async function POST(req: Request) {
  if (!(await isQuoteAuthed())) {
    return NextResponse.json({ error: "UNAUTHORIZED", message: "Unlock the tool first." }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "NO_API_KEY", message: "ANTHROPIC_API_KEY is not set on the server. Add it to the environment and redeploy." },
      { status: 402 },
    );
  }

  let body: AnalyzeRequestBody;
  try {
    body = (await req.json()) as AnalyzeRequestBody;
  } catch {
    return NextResponse.json({ error: "BAD_REQUEST", message: "Invalid JSON body." }, { status: 400 });
  }

  const photos = (body.photos || [])
    .filter((p) => p?.data && ALLOWED_MEDIA.has(p.mediaType))
    .slice(0, MAX_PHOTOS);
  if (!photos.length) {
    return NextResponse.json({ error: "NO_PHOTOS", message: "Upload at least one photo first." }, { status: 400 });
  }

  const imageContents = photos.map((p) => ({
    type: "image" as const,
    source: { type: "base64" as const, media_type: p.mediaType, data: p.data },
  }));

  const contextText = [
    `Analyze these ${photos.length} property photos and generate a complete diagnostic assessment.`,
    body.address ? `Property address: ${body.address}` : "",
    body.propertyType ? `Property type: ${body.propertyType}` : "",
    body.contactName ? `Client contact: ${body.contactName}` : "",
    body.notes
      ? `MANDATORY INSPECTOR FIELD NOTES — READ THIS FIRST:\nEvery item, surface, or condition mentioned below MUST appear as a finding and quoted service in your response. These notes come from a salesperson who physically inspected the property. They take precedence over your photo interpretation.\n---\n${body.notes}\n---`
      : "",
    body.propertyType === "residential" ? RESIDENTIAL_ASK : "",
    "\nReturn ONLY valid JSON, no markdown fences.",
  ]
    .filter(Boolean)
    .join("\n");

  let resp: Response;
  try {
    resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        // Sonnet 5 thinks by default and max_tokens caps thinking + text — keep headroom.
        max_tokens: 16000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: [...imageContents, { type: "text", text: contextText }] }],
      }),
    });
  } catch (e) {
    console.error("Anthropic network error:", e);
    return NextResponse.json(
      { error: "API_ERROR", message: "Could not reach the AI service — check the connection and try again." },
      { status: 502 },
    );
  }

  if (!resp.ok) {
    const text = await resp.text();
    console.error("Anthropic API error:", resp.status, text);
    const friendly =
      resp.status === 401
        ? "The Anthropic API key was rejected — check ANTHROPIC_API_KEY."
        : resp.status === 429
          ? "The AI service is rate-limited right now — wait a minute and try again."
          : resp.status === 529
            ? "The AI service is overloaded — try again in a moment."
            : `The AI service returned an error (${resp.status}).`;
    return NextResponse.json({ error: "API_ERROR", message: friendly }, { status: 502 });
  }

  const data = (await resp.json()) as {
    stop_reason?: string;
    content?: Array<{ type: string; text?: string }>;
  };

  if (data.stop_reason === "refusal") {
    return NextResponse.json(
      { error: "API_ERROR", message: "The AI declined this request. Try different photos or rephrase the notes." },
      { status: 502 },
    );
  }

  // Sonnet 5 responses can include thinking blocks — take the first TEXT block.
  const textBlock = (data.content || []).find((b) => b.type === "text" && b.text);
  if (!textBlock?.text) {
    return NextResponse.json(
      { error: "API_ERROR", message: "The AI returned an empty response — try again." },
      { status: 502 },
    );
  }

  let parsed: {
    conditionScore?: number;
    summaryText?: string;
    findings?: Finding[];
    recommendedServices?: RecommendedService[];
    clarifyingQuestions?: AnalyzeResponse["clarifyingQuestions"];
    observations?: Observations;
  };
  try {
    const cleaned = textBlock.text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/, "");
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("AI JSON parse failed:", e, textBlock.text.slice(0, 500));
    return NextResponse.json(
      { error: "PARSE_ERROR", message: "The AI returned an unreadable response — run the analysis again." },
      { status: 502 },
    );
  }

  // Tiered standalone minimums — enforced server-side, exactly per the approved
  // export logic (shared module, also exercised by scripts/check-pricing.mjs).
  // Homes are priced by the same engine as the /book page (one-time-estimate.ts), from the county
  // record plus what the AI saw. Commercial still uses the rate sheet in prompt.ts.
  const { services, pricingNote, applied } =
    body.propertyType === "residential"
      ? { ...(await priceHome(body.address || "", parsed.observations || {})), applied: null }
      : applyTieredMinimums(parsed.recommendedServices || []);

  const payload: AnalyzeResponse = {
    assessment: {
      conditionScore: parsed.conditionScore || 5,
      summaryText: parsed.summaryText || "",
      findings: parsed.findings || [],
    },
    recommendedServices: services,
    pricingNote,
    minimumApplied: applied,
    clarifyingQuestions: parsed.clarifyingQuestions ?? null,
  };

  return NextResponse.json(payload);
}

// ── Homes: the AI reports what it sees, the engine sets the price ────────────
const RESIDENTIAL_ASK = `PRICING FOR THIS HOME IS DONE SEPARATELY. Do not put prices in summaryText or findings.
Also return an "observations" object describing the house as the photos, video frames and notes show it:
{"stories": 1|2|3 (levels with outside walls to wash, a daylight basement counts),
 "moss": "light"|"patchy"|"thick" (roof moss),
 "windows": number of outside windows on the whole house (estimate the sides you can't see),
 "driveway": "small"|"typical"|"large" (driveway plus front walk),
 "hard": any of ["tall","slope","lift","surface"] (tall = four or more stories; slope = steep hillside around the house; lift = trees, wires or no level spot to park a lift; surface = cedar shake, tile, stucco or old paint),
 "services": the work this house needs, any of ["roof-moss","gutters","house-wash","windows","driveway","deck-fence","other"]. Include everything the notes ask for.
 "sqftEstimate": living area in sq ft if you can judge it,
 "deckSqft": total sq ft of wood or coated deck and balcony floors that need cleaning (0 if none),
 "fenceFt": feet of fence that needs cleaning (0 if none)}`;

interface Observations {
  stories?: number; moss?: Moss; windows?: number; driveway?: Driveway; hard?: Hard[]; services?: ServiceKey[]; sqftEstimate?: number;
  deckSqft?: number; fenceFt?: number;
}

const DESC: Partial<Record<ServiceKey, string>> = {
  "roof-moss": "Moss treatment, loose debris off the roof, gutters flushed",
  gutters: "Gutters cleaned out by hand, downspouts flushed",
  "house-wash": "Soft wash of the siding, eaves and trim",
  windows: "Outside glass, frames and sills",
  driveway: "Driveway and front walk surface cleaned",
};

async function priceHome(address: string, o: Observations): Promise<{ services: RecommendedService[]; pricingNote: string }> {
  const found = address ? await lookupHouse(address) : null;
  const sqft = found?.sqft || (o.sqftEstimate && o.sqftEstimate > 400 ? o.sqftEstimate : 2000);
  const seen = [1, 2, 3].includes(Number(o.stories)) ? (Number(o.stories) as Stories) : null;
  const stories = seen ?? guessStories(sqft, found?.footprintSf) ?? 2;
  const house = { sqft, stories, footprintSf: found?.footprintSf, perimeterFt: found?.perimeterFt };
  const m = measure(house);
  const moss = o.moss && o.moss in MOSS_LABEL ? o.moss : "patchy";
  const windows = o.windows && o.windows > 0 ? Math.round(o.windows) : m.windows;
  const driveway = o.driveway && ["small", "typical", "large"].includes(o.driveway) ? o.driveway : "typical";
  const hard = (o.hard || []).filter((h) => h in HARD);
  const picked = (o.services || []).filter((k) => SERVICES.some((s) => s.key === k));
  const q = quote(house, picked, { moss, windows, driveway, hard });

  const services: RecommendedService[] = q.lines.map((l) => ({
    category: l.label,
    description: l.key === "windows" ? `${DESC.windows}, ${windows} windows` : l.key === "roof-moss" ? `${DESC["roof-moss"]} (${moss} moss)` : DESC[l.key] || l.label,
    estimatedPrice: l.price,
    isAddon: false,
  }));
  // Harder setup: show the normal price marked to check, never $0 (Bri 2026-11-13: $0 read as broken).
  const why = hard.map((h) => HARD[h].label.toLowerCase()).join("; ");
  for (const s of SERVICES.filter((x) => q.review.includes(x.label))) {
    const full = servicePrice(s.key, house, { moss, windows, driveway }) ?? 0;
    const withRoof = s.key === "gutters" && picked.includes("roof-moss"); // the roof job already flushes them
    const alone = withRoof ? Math.round((full * ROOF_GUTTER_SHARE) / 5) * 5 : full;
    services.push({ category: withRoof ? "Full gutter clean, added to the roof" : s.label, description: `${DESC[s.key] || s.label}. CHECK: normal-house price; photos show ${why}`, estimatedPrice: alone, isAddon: false });
  }
  // Deck and fence at the live /plan add-on rates (ADD_ONS in plan/pricing.ts), from the AI's measurements.
  if (picked.includes("deck-fence")) {
    const rate = (k: string) => ADD_ONS.find((a) => a.key === k)?.list?.amount ?? 0;
    const $r = (k: string) => rate(k).toFixed(2);
    const deck = Math.round(o.deckSqft || 0);
    const fence = Math.round(o.fenceFt || 0);
    const r5 = (n: number) => Math.round(n / 5) * 5;
    if (deck > 0) services.push({ category: "Deck and balconies", description: `Soft wash of about ${deck} sq ft of deck and balcony floors (measured from the photos) at $${$r("deck")}/sq ft`, estimatedPrice: r5(deck * rate("deck")), isAddon: false });
    if (fence > 0) services.push({ category: "Fence", description: `About ${fence} ft of fence (measured from the photos) at $${$r("fence")}/ft`, estimatedPrice: r5(fence * rate("fence")), isAddon: false });
    if (!deck && !fence) services.push({ category: "Deck or fence", description: `Couldn't measure it from the photos. Enter sq ft × $${$r("deck")} for a deck, feet × $${$r("fence")} for a fence`, estimatedPrice: 0, isAddon: false });
  }
  for (const label of q.unpriced.filter((l) => l !== "Deck or fence"))
    services.push({ category: label, description: `${label}: set the price from the photos`, estimatedPrice: 0, isAddon: false });
  // Same-visit savings and the visit minimum, over every priced line (same rules as quote()).
  const priced = services.filter((x) => x.estimatedPrice > 0);
  const net = priced.reduce((t, x) => t + x.estimatedPrice, 0) - (priced.length > 1 ? SAME_VISIT_OFF : 0);
  if (priced.length > 1) services.push({ category: "Same visit", description: "Two or more services on one visit", estimatedPrice: -SAME_VISIT_OFF, isAddon: false });
  if (priced.length && net < VISIT_MIN) services.push({ category: "Visit minimum", description: `Brings the visit up to the $${VISIT_MIN} minimum`, estimatedPrice: VISIT_MIN - net, isAddon: false });

  const pricingNote = [
    `Priced for ${sqft.toLocaleString()} sq ft (${found ? "county record" : "estimated, address not in county records"}), ${stories} ${stories === 1 ? "story" : "stories"}${seen ? "" : " (guessed from size)"}.`,
    `About ${m.roofSf.toLocaleString()} sq ft of roof, ${m.gutterLf} ft of gutter, ${windows} windows, ${moss} moss, ${driveway} driveway.`,
    hard.length ? `Harder setup seen (${why}): lines marked CHECK show the normal-house price. Adjust them from the photos.` : "",
    picked.length ? "" : "The AI didn't name any services. Add them on the next step.",
  ].filter(Boolean).join(" ");
  return { services, pricingNote };
}
