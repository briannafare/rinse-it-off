"use server";

import { headers } from "next/headers";
import { createWindow } from "@/lib/abuse-window.mjs";
import { ADD_ONS, DEPOSIT_USD, MULTI_YEAR_PREPAID_DISCOUNT, WINDOW_VISITS_PER_YEAR, addOnPriceLabel, prepaidTermTotal, priceHouse, type HouseInputs, type TermYears } from "./pricing";

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
// Reusable GHL payment link "Membership deposit" ($99 one-time, product
// 6a9794a8973de9c5b84c02fa / price 6a9794a8023939c7eaf5b92b), created via the
// internal API 2026-09-02. The customer pays inside the Reserve step; GHL
// records the transaction on the contact and sends its own receipt.
const DEPOSIT_LINK_ID = process.env.GHL_DEPOSIT_LINK_ID || "6a979615d6768df05444945b";
const DEPOSIT_LINK_BASE = process.env.GHL_PAYMENT_LINK_BASE || "https://links.rinseitoff.com/payment-link";

// Nothing customer-facing goes out from a preview. PLAN_DRY_RUN=false is the
// only way to send for real, and production defaults to live.
const DRY_RUN = process.env.PLAN_DRY_RUN ? process.env.PLAN_DRY_RUN !== "false" : process.env.VERCEL_ENV !== "production";
function dryLog(what: string, payload: unknown) {
  console.log(`[plan dry-run] would ${what}: ${JSON.stringify(payload).slice(0, 600)}`);
}

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
  term?: 1 | 2 | 3; // years the price is locked for
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
    const term: TermYears = data.term === 2 ? 2 : data.term === 3 ? 3 : 1;
    const termTotal = prepaidTermTotal(price.coreAnnual, term);
    // Contract value: the prepaid total for the term, or the monthly year times the term.
    const yearValue = billing === "annual" ? (term > 1 ? termTotal : price.prepaidAnnual) : price.memberAnnual * term;
    const chosenAddOns = ADD_ONS.filter((a) => (data.addOns || []).includes(a.key));

    const nameParts = name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const source = src === "web" ? "Website · plan calculator" : `Postcard · ${src}`;
    const tags = ["plan-quote", "lead-res", `src-${src}`, `billing-${billing}`, `term-${term}y`, ...(flagged ? ["needs-review"] : [])];

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
      "Lines (booked one at a time, per year)",
      ...price.lines.map((l) => `  ${l.label}: $${l.amount.toFixed(2)}  (${l.detail})`),
      `  Seasonal subtotal: $${price.subtotal.toFixed(2)}`,
      `  Site access modifier: x${price.accessMultiplier}`,
      `  Seasonal à la carte annual: $${price.coreAnnual.toFixed(2)}`,
      `  Windows value (free): $${price.windowsAnnualValue} (${WINDOW_VISITS_PER_YEAR} visits)`,
      `  Screens value (free while off, customer removes/reinstalls): $${price.screensAnnualValue}`,
      `  Value received: $${price.valueReceived.toFixed(2)}`,
      "",
      "Price",
      `  Membership, billed monthly: $${price.memberMonthly}/mo ($${price.memberAnnual}/yr)`,
      `  Prepaid year: $${price.prepaidAnnual} ($${price.prepaidMonthlyEquivalent}/mo equivalent)`,
      `  Billing chosen: ${billing}`,
      `  Term: ${term} year${term > 1 ? "s" : ""} (price locked, same monthly rate)${billing === "annual" && term > 1 ? `, prepaid full term $${termTotal} (${Math.round(MULTI_YEAR_PREPAID_DISCOUNT * 100)}% off seasonal)` : ""}`,
      `  Contract value: $${yearValue}`,
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

    if (DRY_RUN) {
      dryLog("create + sms-send a $" + DEPOSIT_USD + " deposit invoice and email the pay link", { contactId: input.contactId, name, email, address });
      await addTags(input.contactId, ["membership-deposit-sent"]);
      return { ok: true, url: `${INVOICE_LINK_BASE}/dry-run` };
    }

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

    // GHL's own invoice email uses the location-wide "Invoice Payment Request"
    // template, whose copy is the quote tool's 50/50 deposit terms. There is no
    // per-send override on the send endpoint (probed 2026-09-01: subject/message,
    // emailSubject/emailMessage, customNotification, templateId, emailTemplateId,
    // sentTo-to-another-address all ignored or rejected), and a draft invoice
    // cannot be paid. Sending with action "sms" flips the invoice to sent
    // (payable) and fires only GHL's short default text ("Rinse It Off sent you
    // invoice INV-… Invoice Link: …"), never that email. Our own email with the
    // membership copy goes out through the Conversations API below.
    try {
      const sendRes = await fetch(`${GHL_API_BASE}/invoices/${invoiceId}/send`, {
        method: "POST",
        headers: ghlHeaders,
        body: JSON.stringify({ altId: GHL_LOCATION_ID, altType: "location", userId: GHL_SENDER_USER_ID, action: "sms", liveMode: true }),
      });
      if (!sendRes.ok) console.error("GHL invoice send (sms) failed:", sendRes.status, await sendRes.text());
    } catch (e) {
      console.error("GHL invoice send error:", e);
    }

    if (email) {
      const first = name.split(" ")[0] || "there";
      const html = [
        `<p>Hi ${first},</p>`,
        `<p>Here's the deposit page for your yearly membership${address ? ` at ${address}` : ""}:<br><a href="${url}">${url}</a></p>`,
        `<p>It's $${DEPOSIT_USD}, it locks your price, and it comes off your first month.</p>`,
        `<p>Once it's in, we'll text you to set up your first visit. Reply to this email if anything looks off.</p>`,
        `<p>Rinse It Off · rinseitoff.com · hello@rinseitoff.com</p>`,
      ].join("\n");
      try {
        const mailRes = await fetch(`${GHL_API_BASE}/conversations/messages`, {
          method: "POST",
          headers: { ...ghlHeaders, Version: "2021-04-15" },
          body: JSON.stringify({
            type: "Email",
            contactId: input.contactId,
            subject: `Your $${DEPOSIT_USD} deposit for the Rinse It Off yearly membership`,
            html,
          }),
        });
        if (!mailRes.ok) console.error("Deposit email failed:", mailRes.status, await mailRes.text());
      } catch (e) {
        console.error("Deposit email error:", e);
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

    if (DRY_RUN) {
      dryLog("book a first visit on the assessment calendar", { contactId: input.contactId, name, startISO: input.startISO, endISO });
      await addTags(input.contactId, ["membership-visit-booked"]);
      return { ok: true };
    }

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

/** The checkout URL for the Reserve step, prefilled where GHL honours it.
 *  Nothing is sent: the customer pays right there and GHL emails its receipt. */
export async function depositCheckout(input: DepositInput): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    if (!looksLikeGhlId(input.contactId)) return { ok: false, error: "We lost track of your details. Go back one step and try again." };
    const q = new URLSearchParams();
    if (input.email) q.set("email", String(input.email).slice(0, 160));
    if (input.name) q.set("name", String(input.name).slice(0, 120));
    const phone = e164(String(input.phone || ""));
    if (phone) q.set("phone", phone);
    const url = `${DEPOSIT_LINK_BASE}/${DEPOSIT_LINK_ID}?${q.toString()}`;
    if (DRY_RUN) dryLog("show the deposit checkout (no send)", { contactId: input.contactId, url });
    await addTags(input.contactId, ["membership-deposit-sent"]);
    return { ok: true, url };
  } catch (e) {
    console.error("depositCheckout error:", e);
    return { ok: false, error: "We couldn't open the deposit checkout just now." };
  }
}

/** After the customer pays inside the Reserve step: look for a successful
 *  $DEPOSIT_USD transaction on the contact and tag membership-deposit-paid. */
export async function confirmDeposit(contactId: string): Promise<{ paid: boolean; error?: string }> {
  try {
    if (!GHL_API_KEY || !GHL_LOCATION_ID || !looksLikeGhlId(contactId)) return { paid: false };
    const res = await fetch(`${GHL_API_BASE}/payments/transactions?altId=${GHL_LOCATION_ID}&altType=location&contactId=${contactId}&limit=20`, {
      headers: ghlHeaders,
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("GHL transactions lookup failed:", res.status, await res.text());
      return { paid: false, error: "We couldn't check the payment just now." };
    }
    const data = (await res.json()) as { data?: { amount?: number; status?: string; createdAt?: string }[] };
    const recent = Date.now() - 24 * 60 * 60 * 1000;
    const hit = (data.data || []).find((t) => Number(t.amount) >= DEPOSIT_USD && /succeeded|paid|success/i.test(String(t.status)) && (!t.createdAt || new Date(t.createdAt).getTime() > recent));
    if (!hit) return { paid: false };
    await addTags(contactId, ["membership-deposit-paid"]);
    await addNote(contactId, `Membership deposit paid: $${hit.amount} (${hit.status}) via the plan page checkout.`);
    return { paid: true };
  } catch (e) {
    console.error("confirmDeposit error:", e);
    return { paid: false, error: "We couldn't check the payment just now." };
  }
}
