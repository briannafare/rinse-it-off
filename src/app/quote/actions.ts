"use server";

/** Server actions for the internal /quote audit tool.
 *  Conventions follow src/app/assessment/actions.ts: env-driven IDs with the
 *  live Rinse It Off defaults, Version header 2021-07-28, fail-soft GHL calls.
 *  Every action re-checks the passcode cookie before touching anything. */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  QUOTE_AUTH_COOKIE,
  QUOTE_AUTH_MAX_AGE,
  expectedAuthToken,
  isQuoteAuthed,
} from "./auth";
import type {
  GhlContactMatch,
  SendQuotePayload,
  SendStepResult,
  SendToGhlResult,
} from "@/lib/quote/types";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// Live GHL IDs (read from the Rinse It Off sub-account via MCP). Env-overridable.
const COMMERCIAL_PIPELINE_ID = process.env.GHL_COMMERCIAL_PIPELINE_ID || "ohb2ZfnHPdrhfCqwqVSE";
const COMMERCIAL_STAGE_ID =
  process.env.GHL_COMMERCIAL_STAGE_ID || "bad7e4f8-2c55-465d-8f19-8d2eaf953bf6"; // "New Lead"
// Residential pipeline does not exist yet — set both envs once Bri creates it.
const RESIDENTIAL_PIPELINE_ID = process.env.GHL_RESIDENTIAL_PIPELINE_ID || "";
const RESIDENTIAL_STAGE_ID = process.env.GHL_RESIDENTIAL_STAGE_ID || "";
// User that estimates are sent from (send endpoints require a real userId).
const GHL_SENDER_USER_ID = process.env.GHL_SENDER_USER_ID || "ZsKRE5X4jKKVTElNy1ed";

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: GHL_VERSION,
  "Content-Type": "application/json",
};

// ── Passcode gate ─────────────────────────────────────────────────────────────
export async function unlockQuoteTool(formData: FormData): Promise<void> {
  const pw = String(formData.get("passcode") ?? "");
  const configured = process.env.QUOTE_PASSWORD;
  if (!configured) redirect("/quote?error=unconfigured");
  if (pw !== configured) redirect("/quote?error=wrong");
  const jar = await cookies();
  jar.set(QUOTE_AUTH_COOKIE, expectedAuthToken()!, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: QUOTE_AUTH_MAX_AGE,
    path: "/",
  });
  redirect("/quote");
}

// ── Contact search (Step 1 "find existing contact") ───────────────────────────
export async function searchGhlContacts(
  query: string,
): Promise<{ ok: boolean; contacts: GhlContactMatch[]; error?: string }> {
  if (!(await isQuoteAuthed())) return { ok: false, contacts: [], error: "Not authorized" };
  const q = (query || "").trim();
  if (q.length < 2) return { ok: true, contacts: [] };
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    return { ok: false, contacts: [], error: "GHL is not configured (missing API key)" };
  }
  try {
    const url = `${GHL_API_BASE}/contacts/?locationId=${encodeURIComponent(
      GHL_LOCATION_ID,
    )}&query=${encodeURIComponent(q)}&limit=10`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${GHL_API_KEY}`, Version: GHL_VERSION },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("GHL contact search failed:", res.status, await res.text());
      return { ok: false, contacts: [], error: `Search failed (${res.status})` };
    }
    const data = (await res.json()) as { contacts?: Array<Record<string, unknown>> };
    const contacts: GhlContactMatch[] = (data.contacts || []).map((c) => ({
      id: String(c.id ?? ""),
      name:
        String(c.contactName ?? "").trim() ||
        `${String(c.firstName ?? "")} ${String(c.lastName ?? "")}`.trim(),
      email: String(c.email ?? ""),
      phone: String(c.phone ?? ""),
      address: String(c.address1 ?? ""),
    }));
    return { ok: true, contacts };
  } catch (e) {
    console.error("searchGhlContacts error:", e);
    return { ok: false, contacts: [], error: "Search failed — network error" };
  }
}

// ── Deposit / auto-invoice builder ────────────────────────────────────────────
/** BEST-READING IMPLEMENTATION — the exact wire shapes of paymentScheduleConfig
 *  and autoInvoice on CreateEstimatesDto are only partially documented (see
 *  research/ghl-capability.md: type=percentage + depositDateType=estimate_accepted
 *  is confirmed; the schedules[] entry shape and autoInvoice sub-schema are not).
 *  Kept in ONE place so a correction is a one-line change. sendQuoteToGhl
 *  retries estimate creation WITHOUT these fields if GHL rejects the body, so
 *  a wrong guess degrades to "estimate without deposit schedule", never a
 *  blocked send. */
function buildDepositScheduleConfig(): Record<string, unknown> {
  return {
    paymentScheduleConfig: {
      type: "percentage",
      dateConfig: {
        depositDateType: "estimate_accepted",
        scheduleDateType: "regular_interval",
      },
      // 50% deposit due when the estimate is accepted; balance on completion.
      schedules: [{ value: 50 }],
    },
    autoInvoice: { enabled: true },
  };
}

const TERMS_NOTES_HTML =
  "<ul><li>Deposit required to schedule</li><li>Balance due upon completion</li><li>Quote valid 30 days</li><li>Services weather-dependent</li><li>Not responsible for pre-existing damage</li></ul>";

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ── Send to GHL (Step 5) ──────────────────────────────────────────────────────
/** Fail-soft pipeline: contact upsert is the only hard dependency. Every later
 *  step reports ok/skip/fail but never throws and never loses earlier progress. */
export async function sendQuoteToGhl(payload: SendQuotePayload): Promise<SendToGhlResult> {
  const fail = (detail: string): SendStepResult => ({ status: "fail", detail });
  const result: SendToGhlResult = {
    contact: fail("Not attempted"),
    opportunity: { status: "skip", detail: "Not attempted" },
    estimate: fail("Not attempted"),
    sent: fail("Not attempted"),
    tag: fail("Not attempted"),
  };

  if (!(await isQuoteAuthed())) {
    result.contact = fail("Not authorized — unlock the tool again");
    return result;
  }
  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    result.contact = fail("GHL not configured (GHL_API_KEY / GHL_LOCATION_ID missing)");
    return result;
  }

  const { contact, propertyType, lineItems, discountPercent, discountReason, total } = payload;
  const isResidential = propertyType === "residential";
  const nameParts = contact.name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  const leadTag = isResidential ? "lead-res" : "lead-com";

  // 1) Upsert contact — the one hard dependency.
  let contactId = "";
  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        firstName,
        lastName,
        name: contact.name,
        email: contact.email || undefined,
        phone: contact.phone || undefined,
        address1: contact.address || undefined,
        source: "Audit Tool — Quote",
        tags: ["property-audit", leadTag],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("GHL contact upsert failed:", res.status, body);
      result.contact = fail(`Upsert failed (${res.status})`);
      return result;
    }
    const data = (await res.json()) as { contact?: { id?: string } };
    contactId = data?.contact?.id || "";
    if (!contactId) {
      result.contact = fail("Upsert returned no contact id");
      return result;
    }
    result.contact = { status: "ok", id: contactId };
  } catch (e) {
    console.error("GHL contact upsert error:", e);
    result.contact = fail("Upsert failed — network error");
    return result;
  }

  // 2) Opportunity — commercial/multifamily/hoa -> commercial pipeline;
  //    residential only when the residential pipeline envs exist.
  const pipelineId = isResidential ? RESIDENTIAL_PIPELINE_ID : COMMERCIAL_PIPELINE_ID;
  const stageId = isResidential ? RESIDENTIAL_STAGE_ID : COMMERCIAL_STAGE_ID;
  if (!pipelineId || !stageId) {
    result.opportunity = {
      status: "skip",
      detail: "Residential pipeline not configured (GHL_RESIDENTIAL_PIPELINE_ID/STAGE_ID)",
    };
  } else {
    try {
      const res = await fetch(`${GHL_API_BASE}/opportunities/`, {
        method: "POST",
        headers: ghlHeaders,
        body: JSON.stringify({
          pipelineId,
          locationId: GHL_LOCATION_ID,
          pipelineStageId: stageId,
          contactId,
          name: `${contact.name} — ${contact.address || "Property quote"}`,
          monetaryValue: total,
          status: "open",
          source: "Audit Tool — Quote",
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { opportunity?: { id?: string }; id?: string };
        result.opportunity = { status: "ok", id: data?.opportunity?.id || data?.id };
      } else {
        const body = await res.text();
        console.error("GHL opportunity failed:", res.status, body);
        result.opportunity = fail(`Opportunity failed (${res.status})`);
      }
    } catch (e) {
      console.error("GHL opportunity error:", e);
      result.opportunity = fail("Opportunity failed — network error");
    }
  }

  // 3) Create estimate.
  const now = new Date();
  const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Quote valid 30 days
  const items = lineItems
    .filter((i) => i.unitPrice > 0 || i.qty * i.unitPrice > 0)
    .map((i) => ({
      name: i.isAddon ? `Add-on: ${i.name}` : i.name,
      description: i.description,
      currency: "USD",
      qty: i.qty,
      amount: i.unitPrice,
    }));
  const sentTo: Record<string, string[]> = {};
  if (contact.email) sentTo.email = [contact.email];
  if (contact.phone) sentTo.phoneNo = [contact.phone];

  const baseEstimateBody: Record<string, unknown> = {
    altId: GHL_LOCATION_ID,
    altType: "location",
    name: `EST : ${contact.name}`,
    title: "ESTIMATE",
    currency: "USD",
    liveMode: true,
    issueDate: isoDate(now),
    expiryDate: isoDate(expiry),
    businessDetails: { name: "Rinse It Off — Fresh Rinse LLC", website: "rinseitoff.com" },
    contactDetails: {
      id: contactId,
      name: contact.name,
      email: contact.email || undefined,
      phoneNo: contact.phone || undefined,
    },
    items,
    discount: {
      type: "percentage",
      value: discountPercent > 0 ? discountPercent : 0,
      ...(discountPercent > 0 && discountReason ? { description: discountReason } : {}),
    },
    termsNotes: TERMS_NOTES_HTML,
    ...(Object.keys(sentTo).length ? { sentTo } : {}),
  };

  let estimateId = "";
  try {
    // First attempt: with the 50%-deposit schedule + autoInvoice (best reading).
    let res = await fetch(`${GHL_API_BASE}/invoices/estimate`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({ ...baseEstimateBody, ...buildDepositScheduleConfig() }),
    });
    let usedDeposit = true;
    if (!res.ok && res.status >= 400 && res.status < 500) {
      // Shape rejected — retry WITHOUT the ambiguous deposit/autoInvoice fields
      // so the core estimate still goes out (fail-soft, per spec).
      const body = await res.text();
      console.warn("Estimate with deposit config rejected, retrying without:", res.status, body);
      res = await fetch(`${GHL_API_BASE}/invoices/estimate`, {
        method: "POST",
        headers: ghlHeaders,
        body: JSON.stringify(baseEstimateBody),
      });
      usedDeposit = false;
    }
    if (res.ok) {
      const data = (await res.json()) as { _id?: string; id?: string; estimate?: { _id?: string; id?: string } };
      estimateId = data._id || data.id || data.estimate?._id || data.estimate?.id || "";
      result.estimate = estimateId
        ? {
            status: "ok",
            id: estimateId,
            detail: usedDeposit
              ? "Created with 50% deposit schedule + auto-invoice"
              : "Created WITHOUT deposit schedule (GHL rejected the schedule fields — set the deposit in the GHL UI)",
          }
        : fail("Estimate created but no id returned");
    } else {
      const body = await res.text();
      console.error("GHL estimate failed:", res.status, body);
      result.estimate = fail(`Estimate failed (${res.status})`);
    }
  } catch (e) {
    console.error("GHL estimate error:", e);
    result.estimate = fail("Estimate failed — network error");
  }

  // 4) Send the estimate (sms + email).
  if (!estimateId) {
    result.sent = { status: "skip", detail: "No estimate to send" };
  } else if (!contact.email && !contact.phone) {
    result.sent = { status: "skip", detail: "Contact has no email or phone" };
  } else {
    try {
      const res = await fetch(`${GHL_API_BASE}/invoices/estimate/${estimateId}/send`, {
        method: "POST",
        headers: ghlHeaders,
        body: JSON.stringify({
          altId: GHL_LOCATION_ID,
          altType: "location",
          userId: GHL_SENDER_USER_ID,
          action: "sms_and_email",
          liveMode: true,
        }),
      });
      if (res.ok) {
        result.sent = { status: "ok" };
      } else {
        const body = await res.text();
        console.error("GHL estimate send failed:", res.status, body);
        result.sent = fail(`Send failed (${res.status}) — estimate saved as draft in GHL`);
      }
    } catch (e) {
      console.error("GHL estimate send error:", e);
      result.sent = fail("Send failed — network error (estimate saved as draft)");
    }
  }

  // 5) Tags: quote-sent + the lead tag (adding an existing tag is a no-op in GHL).
  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/${contactId}/tags`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify({ tags: ["quote-sent", leadTag] }),
    });
    if (res.ok) {
      result.tag = { status: "ok" };
    } else {
      const body = await res.text();
      console.error("GHL tag failed:", res.status, body);
      result.tag = fail(`Tag failed (${res.status})`);
    }
  } catch (e) {
    console.error("GHL tag error:", e);
    result.tag = fail("Tag failed — network error");
  }

  return result;
}
