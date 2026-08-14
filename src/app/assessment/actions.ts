"use server";

import { headers } from "next/headers";
import { createWindow } from "@/lib/abuse-window.mjs";

const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

// Live GHL IDs (read from the Rinse It Off sub-account via MCP 2026-07-09).
// Env-overridable so nothing is hardcoded to one account long-term.
const COMMERCIAL_PIPELINE_ID = process.env.GHL_COMMERCIAL_PIPELINE_ID || "ohb2ZfnHPdrhfCqwqVSE";
const COMMERCIAL_STAGE_ID = process.env.GHL_COMMERCIAL_STAGE_ID || "bad7e4f8-2c55-465d-8f19-8d2eaf953bf6"; // "New Lead"
// "Residential Pressure Washing Pipeline" — created 2026-08-14. Env-set in
// Vercel; if either is missing the opportunity step is skipped, not fatal.
const RESIDENTIAL_PIPELINE_ID = process.env.GHL_RESIDENTIAL_PIPELINE_ID || "";
const RESIDENTIAL_STAGE_ID = process.env.GHL_RESIDENTIAL_STAGE_ID || "";
// "Access Notes / Gate Code" custom field (LARGE_TEXT) — safe free-text.
const CF_ACCESS_NOTES = "sL97gzPiCMVzGZ58Cgns";
// Property Assessment calendar (slug rio-property-audit), 45-min slots, Kenn primary.
const AUDIT_CALENDAR_ID = process.env.GHL_AUDIT_CALENDAR_ID || "tA6NtDSKU60mNlSNXLS9";
const SLOT_MINUTES = 45;
const TZ = "America/Los_Angeles";

// Abuse watch on the one public write path into the CRM. Over FLAG_AFTER
// submits from an IP in 10 minutes the lead still saves but arrives tagged
// `needs-review`; over BLOCK_AFTER nothing is written at all.
// ponytail: per-instance memory, so a flood spread across serverless instances
// still leaks through. Enough to catch a script hammering the form — move the
// counter to Vercel KV if it ever needs to be airtight.
const recordSubmit = createWindow();

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: GHL_VERSION,
  "Content-Type": "application/json",
};

export interface AssessmentFormData {
  propertyType: string; // "commercial" | "residential"
  services: string[];
  name: string;
  phone: string;
  email: string;
  address: string;
  message: string;
  appointmentDate?: string;
  appointmentTime?: string;
  appointmentISO?: string; // exact slot from GHL free-slots (has -07:00/-08:00 offset)
}

/** Real availability for the audit calendar. Returns { "YYYY-MM-DD": ISO[] } in
 *  Pacific time — GHL stamps the offset, so the client can render + submit slots
 *  directly. Read-only; safe to call from the client via this server action. */
export async function getFreeSlots(
  startMs: number,
  endMs: number
): Promise<{ ok: boolean; days: Record<string, string[]> }> {
  if (!GHL_API_KEY) return { ok: false, days: {} };
  try {
    const url = `${GHL_API_BASE}/calendars/${AUDIT_CALENDAR_ID}/free-slots?startDate=${startMs}&endDate=${endMs}&timezone=${encodeURIComponent(TZ)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${GHL_API_KEY}`, Version: "2021-04-15" },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("GHL free-slots failed:", res.status, await res.text());
      return { ok: false, days: {} };
    }
    const data = (await res.json()) as Record<string, unknown>;
    const days: Record<string, string[]> = {};
    for (const [key, val] of Object.entries(data)) {
      // date keys look like "2026-07-13"; each has { slots: string[] }
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && val && Array.isArray((val as { slots?: string[] }).slots)) {
        days[key] = (val as { slots: string[] }).slots;
      }
    }
    return { ok: true, days };
  } catch (e) {
    console.error("getFreeSlots error:", e);
    return { ok: false, days: {} };
  }
}

export async function submitAssessmentForm(
  data: AssessmentFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { count, flagged, blocked } = recordSubmit(ip);
    if (blocked) {
      console.error(`[abuse] assessment submit BLOCKED — ${count} from ${ip} in 10 min`);
      return {
        success: false,
        error: "Too many requests from this connection. Please call us at (503) 704-3755.",
      };
    }
    if (flagged) {
      console.warn(`[abuse] assessment submit #${count} from ${ip} in 10 min — tagging needs-review`);
    }

    if (!GHL_API_KEY) {
      console.error("Missing GHL_API_KEY");
      throw new Error("Missing GHL_API_KEY");
    }
    if (!GHL_LOCATION_ID) {
      console.error("Missing GHL_LOCATION_ID");
      throw new Error("Missing GHL_LOCATION_ID");
    }

    const isCommercial = data.propertyType === "commercial";
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const notesLines: string[] = [
      `Property Type: ${data.propertyType}`,
      `Services Requested: ${data.services.join(", ") || "Not specified"}`,
    ];
    if (data.address) notesLines.push(`Property Address: ${data.address}`);
    if (data.appointmentDate && data.appointmentTime) {
      notesLines.push(`Requested Assessment: ${data.appointmentDate} at ${data.appointmentTime}`);
    }
    if (data.message) notesLines.push(`Notes: ${data.message}`);

    const customFields = data.message
      ? [{ id: CF_ACCESS_NOTES, value: data.message }]
      : [];

    const payload: Record<string, unknown> = {
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      address1: data.address || undefined,
      source: "Website — Property Audit",
      tags: [
        "property-audit",
        "website-assessment",
        isCommercial ? "lead-com" : "lead-res",
        ...(flagged ? ["needs-review"] : []),
      ],
      customFields,
    };

    // 1) Create the contact (hard requirement — a failure here fails the submit)
    const contactRes = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: ghlHeaders,
      body: JSON.stringify(payload),
    });

    if (!contactRes.ok) {
      const errBody = await contactRes.text();
      console.error("GHL contact creation failed:", contactRes.status, errBody);
      return {
        success: false,
        error: "Failed to save your request. Please call us directly at (503) 704-3755.",
      };
    }

    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    // 2) Create an opportunity so the lead enters the sales pipeline.
    //    Commercial -> Commercial pipeline "New Lead". Residential -> its own
    //    pipeline once it exists (env). Fail-soft: never blocks the lead.
    const pipelineId = isCommercial ? COMMERCIAL_PIPELINE_ID : RESIDENTIAL_PIPELINE_ID;
    const stageId = isCommercial ? COMMERCIAL_STAGE_ID : RESIDENTIAL_STAGE_ID;
    if (contactId && pipelineId && stageId) {
      try {
        const oppRes = await fetch(`${GHL_API_BASE}/opportunities/`, {
          method: "POST",
          headers: ghlHeaders,
          body: JSON.stringify({
            pipelineId,
            locationId: GHL_LOCATION_ID,
            pipelineStageId: stageId,
            contactId,
            name: `${data.name} — ${isCommercial ? "Commercial" : "Residential"} property audit`,
            status: "open",
            source: "Website — Property Audit",
          }),
        });
        if (!oppRes.ok) {
          console.error("GHL opportunity creation failed:", oppRes.status, await oppRes.text());
        }
      } catch (e) {
        console.error("GHL opportunity error:", e);
      }
    } else if (contactId && !isCommercial) {
      console.warn(
        "Residential opportunity skipped — set GHL_RESIDENTIAL_PIPELINE_ID/STAGE_ID once the Residential pipeline exists."
      );
    }

    // 3) Attach a note with the full structured request (fail-soft).
    if (contactId && notesLines.length > 0) {
      try {
        await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
          method: "POST",
          headers: ghlHeaders,
          // userId omitted on purpose: it must be a STAFF id, not the contact id.
          body: JSON.stringify({ body: notesLines.join("\n") }),
        });
      } catch (e) {
        console.error("GHL note error:", e);
      }
    }

    // 4) Book the real audit appointment on the property-assessment calendar.
    //    appointmentISO comes straight from GHL free-slots (already offset-stamped),
    //    so no timezone math. Fail-soft: a booking error never loses the lead —
    //    the requested time is in the note and the crew follows up.
    if (contactId && data.appointmentISO) {
      try {
        const startISO = data.appointmentISO;
        const endISO = new Date(new Date(startISO).getTime() + SLOT_MINUTES * 60000).toISOString();
        const apptRes = await fetch(`${GHL_API_BASE}/calendars/events/appointments`, {
          method: "POST",
          headers: { ...ghlHeaders, Version: "2021-04-15" },
          body: JSON.stringify({
            calendarId: AUDIT_CALENDAR_ID,
            locationId: GHL_LOCATION_ID,
            contactId,
            startTime: startISO,
            endTime: endISO,
            title: `Property audit — ${data.name}`,
            appointmentStatus: "confirmed",
          }),
        });
        if (!apptRes.ok) {
          console.error("GHL appointment creation failed:", apptRes.status, await apptRes.text());
        }
      } catch (e) {
        console.error("GHL appointment error:", e);
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Assessment form submission error:", err);
    return { success: false, error: "Something went wrong. Please call us at (503) 704-3755." };
  }
}
