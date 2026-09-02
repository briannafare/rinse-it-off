"use server";

import { headers } from "next/headers";
import { createWindow } from "@/lib/abuse-window.mjs";
import { ADD_ONS, DEPOSIT_USD, WINDOW_VISITS_PER_YEAR, addOnPriceLabel, priceHouse, type HouseInputs } from "./pricing";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// "Residential Pressure Washing Pipeline". Env-set in Vercel and .env.local;
// if either is missing the opportunity step is skipped, not fatal.
const RESIDENTIAL_PIPELINE_ID = process.env.GHL_RESIDENTIAL_PIPELINE_ID || "";
const RESIDENTIAL_STAGE_ID = process.env.GHL_RESIDENTIAL_STAGE_ID || "";

// Property Assessment calendar (same one the /assessment form books), 45-min slots.
const AUDIT_CALENDAR_ID = process.env.GHL_AUDIT_CALENDAR_ID || "tA6NtDSKU60mNlSNXLS9";
const SLOT_MINUTES = 45;
// Staff user the deposit invoice is emailed from (send endpoints need a real userId).
const GHL_SENDER_USER_ID = process.env.GHL_SENDER_USER_ID || "ZsKRE5X4jKKVTElNy1ed";
// Public invoice page. The branded links domain is what GHL's own invoice
// emails resolve to (verified 2026-09-01: links.rinseitoff.com/l/... 302s to
// links.rinseitoff.com/invoice/<id>). link.msgsndr.com/invoice/<id> also works.
const INVOICE_LINK_BASE = process.env.GHL_INVOICE_LINK_BASE || "https://links.rinseitoff.com/invoice";

// Same abuse watch as the assessment form (per-instance sliding window).
const recordSubmit = createWindow();

const isoDate = (d: Date) => d.toISOString().slice(0, 10);
const looksLikeGhlId = (v: unknown) => typeof v === "string" && /^[A-Za-z0-9]{10,40}$/.test(v);
/** "(503) 555-0142" -> "+15035550142". The invoice API insists on E.164; anything
 *  we can't normalise is dropped rather than rejected. */
function e164(raw: string): string | undefined {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return raw.startsWith("+") && d.length >= 8 ? `+${d}` : undefined;
}

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
  billing?: "monthly" | "annual";
  src: string; // from ?src= on the URL, carried through the form
}

export interface PlanQuoteResult {
  success: boolean;
  /** false when the CRM write failed but the customer still saw their price. */
  saved: boolean;
  memberMonthly: number;
  /** Needed by the optional deposit and first-visit steps. */
  contactId?: string;
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
    const billing = data.billing === "annual" ? "annual" : "monthly";
    const yearValue = billing === "annual" ? price.prepaidAnnual : price.memberAnnual;
    const chosenAddOns = ADD_ONS.filter((a) => (data.addOns || []).includes(a.key));

    const nameParts = name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const source = src === "web" ? "Website · plan calculator" : `Postcard · ${src}`;
    const tags = ["plan-quote", "lead-res", `src-${src}`, `billing-${billing}`, ...(flagged ? ["needs-review"] : [])];

    // The full calculator, as a note a human can read in the contact record.
    const noteLines: string[] = [
      `YEARLY MEMBERSHIP QUOTE (${new Date().toLocaleDateString("en-US", { timeZone: "America/Los_Angeles" })})`,
      `Source: ${source}`,
      "",
      "House",
      `  Address: ${house.address || "not given"}`,
      `  Living area: ${house.livingSqft.toLocaleString()} sq ft`,
      `  Stories: ${house.stories === 3 ? "3+" : house.stories}`,
      `  Exterior windows: ${house.windows} (free with the membership, valued at $${price.windowsPerVisitValue} a visit)`,
      `  Roof: ${house.roof}`,
      `  Driveway and walkways: ${house.driveway}`,
      `  Access: ${house.access}`,
      "",
      "Core lines (booked one at a time, per year)",
      ...price.lines.map((l) => `  ${l.label}: $${l.amount.toFixed(2)}  (${l.detail})`),
      `  Subtotal: $${price.subtotal.toFixed(2)}`,
      `  Access modifier: x${price.accessMultiplier}`,
      `  Core à la carte annual: $${price.coreAnnual.toFixed(2)}`,
      `  Windows value (free): $${price.windowsAnnualValue} (${WINDOW_VISITS_PER_YEAR} visits)`,
      `  Value received: $${price.valueReceived.toFixed(2)}`,
      "",
      "Price",
      `  Membership, billed monthly: $${price.memberMonthly}/mo ($${price.memberAnnual}/yr)`,
      `  Prepaid year: $${price.prepaidAnnual} ($${price.prepaidMonthlyEquivalent}/mo equivalent)`,
      `  Billing chosen: ${billing}`,
      `  Saved vs one at a time: $${price.savedVsAlaCarte}`,
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
            monetaryValue: yearValue,
          }),
        });
        if (!oppRes.ok) {
          const errText = await oppRes.text();
          // A repeat visitor already has an open opportunity: refresh its value instead.
          const existingId = /"existingId":"([A-Za-z0-9]+)"/.exec(errText)?.[1];
          if (oppRes.status === 400 && existingId) {
            const upd = await fetch(`${GHL_API_BASE}/opportunities/${existingId}`, {
              method: "PUT",
              headers: ghlHeaders,
              body: JSON.stringify({ name: `Yearly membership · ${house.address || name}`, monetaryValue: yearValue, source }),
            });
            if (!upd.ok) console.error("GHL opportunity update failed:", upd.status, await upd.text());
          } else {
            console.error("GHL opportunity creation failed:", oppRes.status, errText);
          }
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

    return { success: true, saved: true, memberMonthly: price.memberMonthly, contactId };
  } catch (err) {
    console.error("Plan quote submission error:", err);
    return fallback;
  }
}

async function addTags(contactId: string, tags: string[]) {
  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({ tags }),
    });
    if (!res.ok) console.error("GHL tag failed:", res.status, await res.text());
  } catch (e) {
    console.error("GHL tag error:", e);
  }
}

async function addNote(contactId: string, body: string) {
  try {
    await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({ body }),
    });
  } catch (e) {
    console.error("GHL note error:", e);
  }
}

export interface DepositInput {
  contactId: string;
  address: string;
  name: string;
  email: string;
  phone: string;
}

/** Creates a GHL invoice for the deposit, emails it to the customer, and
 *  returns the public payment page. Payment itself happens on GHL's page, so
 *  we have no in-request way to know it was paid: the contact is tagged
 *  `membership-deposit-sent` here, and `membership-deposit-paid` is left for a
 *  GHL workflow on the invoice-paid trigger. */
export async function createDepositInvoice(input: DepositInput): Promise<{ ok: boolean; url?: string; error?: string }> {
  const soft = { ok: false, error: "We couldn't open the deposit page just now. We'll text you a link instead." };
  try {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { count, blocked } = recordSubmit(ip);
    if (blocked) {
      console.error(`[abuse] deposit BLOCKED, ${count} from ${ip} in 10 min`);
      return soft;
    }
    if (!GHL_API_KEY || !GHL_LOCATION_ID || !looksLikeGhlId(input.contactId)) return soft;

    const address = String(input.address || "").trim().slice(0, 200);
    const name = String(input.name || "").trim().slice(0, 120);
    const email = String(input.email || "").trim().slice(0, 160);
    const phone = String(input.phone || "").trim().slice(0, 40);
    const now = new Date();
    const due = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const res = await fetch(`${GHL_API_BASE}/invoices/`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({
        altId: GHL_LOCATION_ID,
        altType: "location",
        name: `Membership deposit · ${address || name}`,
        title: "INVOICE",
        currency: "USD",
        liveMode: true,
        issueDate: isoDate(now),
        dueDate: isoDate(due),
        businessDetails: { name: "Rinse It Off", website: "rinseitoff.com" },
        contactDetails: { id: input.contactId, name, email: email || undefined, phoneNo: e164(phone) },
        items: [
          {
            name: "Membership deposit",
            description: "Holds your route slot. Applied to your first month.",
            currency: "USD",
            qty: 1,
            amount: DEPOSIT_USD,
          },
        ],
        termsNotes: "<p>Applied to your first month. Refundable any time before your first visit.</p>",
      }),
    });
    if (!res.ok) {
      console.error("GHL invoice create failed:", res.status, await res.text());
      return soft;
    }
    const data = (await res.json()) as { _id?: string; id?: string };
    const invoiceId = data._id || data.id;
    if (!invoiceId) return soft;
    const url = `${INVOICE_LINK_BASE}/${invoiceId}`;

    // Email it too, so the link is in their inbox. Fail-soft: the page link works regardless.
    if (email) {
      try {
        const sendRes = await fetch(`${GHL_API_BASE}/invoices/${invoiceId}/send`, {
          method: "POST",
          headers: ghlHeaders,
          body: JSON.stringify({ altId: GHL_LOCATION_ID, altType: "location", userId: GHL_SENDER_USER_ID, action: "email", liveMode: true }),
        });
        if (!sendRes.ok) console.error("GHL invoice send failed:", sendRes.status, await sendRes.text());
      } catch (e) {
        console.error("GHL invoice send error:", e);
      }
    }

    await addTags(input.contactId, ["membership-deposit-sent"]);
    await addNote(input.contactId, `Deposit invoice created: $${DEPOSIT_USD}, invoice ${invoiceId}\n${url}`);
    return { ok: true, url };
  } catch (e) {
    console.error("createDepositInvoice error:", e);
    return soft;
  }
}

export interface BookVisitInput {
  contactId: string;
  name: string;
  startISO: string; // straight from getFreeSlots, offset-stamped by GHL
}

/** Books the first visit on the Property Assessment calendar. */
export async function bookFirstVisit(input: BookVisitInput): Promise<{ ok: boolean; error?: string }> {
  const soft = { ok: false, error: "That time didn't go through. Pick another, or skip and we'll text you." };
  try {
    const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { count, blocked } = recordSubmit(ip);
    if (blocked) {
      console.error(`[abuse] booking BLOCKED, ${count} from ${ip} in 10 min`);
      return soft;
    }
    if (!GHL_API_KEY || !GHL_LOCATION_ID || !looksLikeGhlId(input.contactId)) return soft;
    const start = new Date(input.startISO);
    if (Number.isNaN(start.getTime()) || start.getTime() < Date.now()) return soft;
    const endISO = new Date(start.getTime() + SLOT_MINUTES * 60000).toISOString();
    const name = String(input.name || "").trim().slice(0, 120);

    const res = await fetch(`${GHL_API_BASE}/calendars/events/appointments`, {
      method: "POST",
      headers: { ...ghlHeaders, Version: "2021-04-15" },
      body: JSON.stringify({
        calendarId: AUDIT_CALENDAR_ID,
        locationId: GHL_LOCATION_ID,
        contactId: input.contactId,
        startTime: input.startISO,
        endTime: endISO,
        title: `First membership visit · ${name}`,
        appointmentStatus: "confirmed",
      }),
    });
    if (!res.ok) {
      console.error("GHL appointment creation failed:", res.status, await res.text());
      return soft;
    }
    await addTags(input.contactId, ["membership-visit-booked"]);
    return { ok: true };
  } catch (e) {
    console.error("bookFirstVisit error:", e);
    return soft;
  }
}
