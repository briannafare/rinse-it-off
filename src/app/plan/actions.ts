"use server";

import { headers } from "next/headers";
import { createWindow } from "@/lib/abuse-window.mjs";
import { ADD_ONS, addOnPriceLabel, priceHouse, type HouseInputs } from "./pricing";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// "Residential Pressure Washing Pipeline". Env-set in Vercel and .env.local;
// if either is missing the opportunity step is skipped, not fatal.
const RESIDENTIAL_PIPELINE_ID = process.env.GHL_RESIDENTIAL_PIPELINE_ID || "";
const RESIDENTIAL_STAGE_ID = process.env.GHL_RESIDENTIAL_STAGE_ID || "";

// Same abuse watch as the assessment form (per-instance sliding window).
const recordSubmit = createWindow();

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: GHL_VERSION,
  "Content-Type": "application/json",
};

export interface PlanQuoteData {
  house: HouseInputs;
  addOns: string[]; // AddOn keys
  name: string;
  phone: string;
  email: string;
  bestDay: string;
  src: string; // from ?src= on the URL, carried through the form
}

export interface PlanQuoteResult {
  success: boolean;
  /** false when the CRM write failed but the customer still saw their price. */
  saved: boolean;
  memberMonthly: number;
  error?: string;
}

/** Only letters, digits and dashes survive; anything else becomes "web". */
function cleanSrc(raw: string | undefined | null): string {
  const s = (raw || "").toLowerCase().trim();
  return /^[a-z0-9-]{1,40}$/.test(s) ? s : "web";
}

function cleanHouse(h: HouseInputs): HouseInputs {
  const num = (n: unknown, max: number) => Math.min(max, Math.max(0, Math.floor(Number(n) || 0)));
  const stories = h.stories === 2 ? 2 : h.stories === 3 ? 3 : 1;
  const roof = h.roof === "shake-steep" || h.roof === "metal-tile" ? h.roof : "composition";
  const driveway = h.driveway === "small" || h.driveway === "large" ? h.driveway : "typical";
  const access = h.access === "gated-tight" || h.access === "steep-ladder" ? h.access : "easy";
  return {
    address: String(h.address || "").trim().slice(0, 200),
    livingSqft: num(h.livingSqft, 50000),
    stories,
    windows: num(h.windows, 500),
    roof,
    driveway,
    access,
  };
}

export async function submitPlanQuote(data: PlanQuoteData): Promise<PlanQuoteResult> {
  const house = cleanHouse(data.house);
  const price = priceHouse(house);
  const src = cleanSrc(data.src);
  const fallback: PlanQuoteResult = { success: true, saved: false, memberMonthly: price.memberMonthly };

  try {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { count, flagged, blocked } = recordSubmit(ip);
    if (blocked) {
      console.error(`[abuse] plan submit BLOCKED, ${count} from ${ip} in 10 min`);
      return {
        success: false,
        saved: false,
        memberMonthly: price.memberMonthly,
        error: "Too many requests from this connection. Call or text us at (503) 704-3755 and we'll lock it in by hand.",
      };
    }
    if (flagged) {
      console.warn(`[abuse] plan submit #${count} from ${ip} in 10 min, tagging needs-review`);
    }

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      console.error("Missing GHL_API_KEY or GHL_LOCATION_ID");
      return fallback;
    }

    const name = String(data.name || "").trim().slice(0, 120);
    const phone = String(data.phone || "").trim().slice(0, 40);
    const email = String(data.email || "").trim().slice(0, 160);
    const bestDay = String(data.bestDay || "").trim().slice(0, 40);
    const chosenAddOns = ADD_ONS.filter((a) => (data.addOns || []).includes(a.key));

    const nameParts = name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const source = src === "web" ? "Website · plan calculator" : `Postcard · ${src}`;
    const tags = ["plan-quote", "lead-res", `src-${src}`, ...(flagged ? ["needs-review"] : [])];

    // The full calculator, as a note a human can read in the contact record.
    const noteLines: string[] = [
      `YEARLY MEMBERSHIP QUOTE (${new Date().toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" })})`,
      `Source: ${source}`,
      "",
      "House",
      `  Address: ${house.address || "not given"}`,
      `  Living area: ${house.livingSqft.toLocaleString()} sq ft (tier ${price.tier.code}, ${price.tier.label})`,
      `  Stories: ${house.stories === 3 ? "3+" : house.stories}`,
      `  Exterior windows: ${house.windows} (${price.windowsIncluded} in plan${price.windowsExtra ? `, ${price.windowsExtra} extra` : ""})`,
      `  Roof: ${house.roof}`,
      `  Driveway and walkways: ${house.driveway}`,
      `  Access: ${house.access}`,
      "",
      "Lines (à la carte per year)",
      ...price.lines.map((l) => `  ${l.label}: $${l.amount.toFixed(2)}  (${l.detail})`),
      `  Subtotal: $${price.subtotal.toFixed(2)}`,
      `  Access modifier: x${price.accessMultiplier}`,
      `  À la carte annual: $${price.alaCarteAnnual.toFixed(2)}`,
      "",
      "Price",
      `  Membership, billed monthly: $${price.memberMonthly}/mo ($${price.memberAnnual}/yr)`,
      `  Prepaid year: $${price.prepaidAnnual} ($${price.prepaidMonthlyEquivalent}/mo equivalent)`,
      "",
      `Add-ons asked about (member price, quantities measured at first visit)`,
      ...(chosenAddOns.length ? chosenAddOns.map((a) => `  ${a.label}: ${addOnPriceLabel(a)}`) : ["  none"]),
      "",
      `Best day for visits: ${bestDay || "no preference"}`,
    ];

    // 1) Upsert the contact (matches on email/phone so a repeat visitor does
    //    not become a duplicate).
    const contactRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        firstName,
        lastName,
        name,
        email: email || undefined,
        phone,
        address1: house.address || undefined,
        source,
        tags,
      }),
    });
    if (!contactRes.ok) {
      console.error("GHL contact upsert failed:", contactRes.status, await contactRes.text());
      return fallback;
    }
    const contactData = await contactRes.json();
    const contactId: string | undefined = contactData?.contact?.id;
    if (!contactId) {
      console.error("GHL upsert returned no contact id");
      return fallback;
    }

    // 2) Opportunity in the Residential pipeline, worth the membership year.
    if (RESIDENTIAL_PIPELINE_ID && RESIDENTIAL_STAGE_ID) {
      try {
        const oppRes = await fetch(`${GHL_API_BASE}/opportunities/`, {
          method: "POST",
          headers: ghlHeaders,
          body: JSON.stringify({
            pipelineId: RESIDENTIAL_PIPELINE_ID,
            locationId: GHL_LOCATION_ID,
            pipelineStageId: RESIDENTIAL_STAGE_ID,
            contactId,
            name: `Yearly membership · ${house.address || name}`,
            status: "open",
            source,
            monetaryValue: price.memberAnnual,
          }),
        });
        if (!oppRes.ok) {
          console.error("GHL opportunity creation failed:", oppRes.status, await oppRes.text());
        }
      } catch (e) {
        console.error("GHL opportunity error:", e);
      }
    } else {
      console.warn("Residential opportunity skipped: GHL_RESIDENTIAL_PIPELINE_ID/STAGE_ID not set.");
    }

    // 3) The structured note (fail-soft).
    try {
      await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: ghlHeaders,
        // userId omitted on purpose: it must be a STAFF id, not the contact id.
        body: JSON.stringify({ body: noteLines.join("\n") }),
      });
    } catch (e) {
      console.error("GHL note error:", e);
    }

    return { success: true, saved: true, memberMonthly: price.memberMonthly };
  } catch (err) {
    console.error("Plan quote submission error:", err);
    return fallback;
  }
}
