/** Print-export HTML builders — ported from the approved
 *  rio_pricing_fix_export/client/src/pages/Job.tsx templates:
 *    - buildClientQuoteHTML     (client-facing: price/scope only)
 *    - buildInternalJobSheetHTML (crew detail: chemicals/dwell/PSI, INTERNAL USE ONLY)
 *  Used from the client via window.open + document.write + print().
 *  Photos are embedded as data URIs so the document is fully portable. */

import type { Finding, QuoteLineItem } from "./types";

export interface PrintQuoteInput {
  quoteNumber: string;
  propertyAddress: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  assessment: { conditionScore: number; summaryText: string };
  findings: Finding[];
  lineItems: QuoteLineItem[];
  subtotal: number;
  discountPct: number;
  discountLabel: string;
  discountAmt: number;
  total: number;
  /** data URIs (preferred) or absolute URLs */
  photoUrls: string[];
  /** absolute URL or data URI for the logo */
  logoUrl: string;
}

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function money(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2 });
}

// Shared <style> block used by both the internal job sheet and the client quote.
function reportStyles(scoreColor: string): string {
  return `@import url('https://use.typekit.net/asf7gwn.css');*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'neue-haas-grotesk-text','Segoe UI',Arial,sans-serif;font-size:14px;color:#111827;background:white;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}.page{max-width:860px;margin:0 auto;padding:40px;}.header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:2px solid #e5e7eb;margin-bottom:28px;}.logo-wrap{display:flex;align-items:center;gap:12px;}.logo-text .name{font-size:22px;font-weight:700;color:#0C1215;letter-spacing:-0.03em;font-family:'Neue Haas Grotesk Display',Arial,sans-serif;letter-spacing:-0.5px;}.logo-text .sub{font-size:12px;color:#6b7280;margin-top:2px;}.meta-block{text-align:right;font-size:12px;color:#6b7280;line-height:1.7;}.meta-block strong{color:#111827;display:block;font-size:14px;font-weight:700;}.section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#8C9AA5;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #E4ECF1;}.summary-box{display:flex;gap:16px;align-items:flex-start;background:#f9fafb;border-radius:10px;padding:16px;margin-bottom:28px;}.score-ring{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;border:3px solid ${scoreColor};color:${scoreColor};flex-shrink:0;}.diy-box{background:#fff7ed;border:1.5px solid #fed7aa;border-radius:10px;padding:16px;margin-bottom:28px;font-size:13px;color:#9a3412;line-height:1.7;}table{width:100%;border-collapse:collapse;margin-bottom:28px;}thead tr{background:#0C1215;color:white;}thead th{padding:10px 12px;text-align:left;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;}tbody tr:nth-child(even){background:#f9fafb;}.total-row td{padding:12px;font-weight:700;font-size:15px;background:#0C1215;color:white;}.subtotal-row td{padding:8px 12px;font-size:13px;color:#6b7280;border-top:1px solid #e5e7eb;}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;font-size:12px;}.info-label{color:#9ca3af;text-transform:uppercase;font-size:10px;letter-spacing:0.05em;font-weight:600;margin-bottom:2px;}.info-value{color:#111827;font-weight:500;}.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:11px;color:#9ca3af;}`;
}

// Build the line-items table body (excludes the $0 "Pricing Note" pseudo-item).
function buildLineItemsHTML(lineItems: QuoteLineItem[]): string {
  const priced = lineItems.filter((i) => i.category !== "Pricing Note");
  const grouped = priced.reduce<Record<string, QuoteLineItem[]>>((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
  return Object.entries(grouped)
    .map(
      ([cat, items]) => `
    <tr><td colspan="3" style="background:#f3f4f6;padding:6px 12px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280;">${esc(cat)}</td></tr>
    ${items
      .map(
        (i) => `<tr style="${i.isAddon ? "color:#6b7280;font-style:italic;" : ""}">
      <td style="padding:8px 12px;font-size:13px;padding-left:${i.isAddon ? "28px" : "12px"}">${i.isAddon ? "&#8627; " : ""}${esc(i.description)}${i.isAddon ? " (Add-on)" : ""}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;">${i.qty > 1 ? `${i.qty} &times; $${i.unitPrice.toLocaleString()}` : ""}</td>
      <td style="padding:8px 12px;text-align:right;font-size:13px;font-weight:${i.isAddon ? "normal" : "500"};">${i.isAddon ? "+" : ""}$${money(i.qty * i.unitPrice)}</td>
    </tr>`,
      )
      .join("")}`,
    )
    .join("");
}

function buildPhotosHTML(photoUrls: string[]): string {
  return photoUrls.length > 0
    ? `
    <div style="margin-bottom:28px;">
      <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#00A8D8;margin-bottom:12px;padding-bottom:6px;border-bottom:1.5px solid #00A8D8;">Property Photos</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
        ${photoUrls.map((url) => `<img src="${url}" style="width:100%;height:160px;object-fit:cover;border-radius:6px;border:1px solid #e5e7eb;" />`).join("")}
      </div>
    </div>`
    : "";
}

function scoreColorFor(score: number): string {
  return score <= 3 ? "#3AA8D4" : score <= 6 ? "#D97706" : "#DC4B2A";
}

const SERVICE_NOTES_HTML = `<div style="background:#f9fafb;border-radius:10px;padding:16px;font-size:12px;color:#6b7280;line-height:1.8;margin-bottom:28px;"><strong style="color:#111827;display:block;margin-bottom:6px;">Service Notes</strong>&bull; Pricing estimated from photos &mdash; may vary upon on-site inspection.<br>&bull; 50% deposit required to schedule; balance due upon completion.<br>&bull; Accepted: Cash, Check (Fresh Rinse LLC), Venmo, or Credit Card.<br>&bull; Rinse It Off / Fresh Rinse LLC is fully licensed and insured in Oregon.<br>&bull; Satisfaction guarantee: Contact us within 24 hours of completion.</div>`;

function headerHTML(input: PrintQuoteInput, metaTitle: string, dateLabel: string, date: string): string {
  return `<div class="header">
    <div class="logo-wrap">
      <img src="${input.logoUrl}" alt="Rinse It Off" style="height:60px;width:auto;object-fit:contain;background:white;border-radius:6px;padding:3px 6px;" />
      <div class="logo-text">
        <div class="sub">a Fresh Rinse LLC Company &middot; www.rinseitoff.com</div>
        <div class="sub">hello@rinseitoff.com &middot; 971-427-6465</div>
      </div>
    </div>
    <div class="meta-block"><strong>${metaTitle}</strong>${dateLabel}: ${date}<br>Quote #: ${esc(input.quoteNumber)}</div>
  </div>`;
}

function propertyContactHTML(input: PrintQuoteInput): string {
  return `<div class="two-col">
    <div><div class="info-label">Property</div><div class="info-value">${esc(input.propertyAddress)}</div></div>
    <div>${input.contactName ? `<div class="info-label">Contact</div><div class="info-value">${esc(input.contactName)}</div>` : ""}${input.contactEmail ? `<div style="color:#6b7280;font-size:12px;">${esc(input.contactEmail)}</div>` : ""}${input.contactPhone ? `<div style="color:#6b7280;font-size:12px;">${esc(input.contactPhone)}</div>` : ""}</div>
  </div>`;
}

function summaryHTML(input: PrintQuoteInput): string {
  return `<div class="section-title">Diagnostic Summary</div>
  <div class="summary-box"><div class="score-ring">${input.assessment.conditionScore}/10</div><div><div style="font-size:13px;color:#374151;line-height:1.7;">${esc(input.assessment.summaryText)}</div></div></div>`;
}

function totalsTableHTML(input: PrintQuoteInput): string {
  const lineItemsHTML = buildLineItemsHTML(input.lineItems);
  const discountRow =
    input.discountPct > 0
      ? `<tr><td colspan="2" style="padding:8px 12px;font-size:13px;color:#16a34a;">${esc(input.discountLabel)} (${input.discountPct}%)</td><td style="padding:8px 12px;text-align:right;font-size:13px;color:#16a34a;">-$${money(input.discountAmt)}</td></tr>`
      : "";
  return `<table><thead><tr><th>Service</th><th style="text-align:right;">Details</th><th style="text-align:right;">Amount</th></tr></thead><tbody>${lineItemsHTML}<tr class="subtotal-row"><td colspan="2">Subtotal</td><td style="text-align:right;">$${money(input.subtotal)}</td></tr>${discountRow}<tr class="total-row"><td colspan="2">TOTAL DUE</td><td style="text-align:right;">$${money(input.total)}</td></tr></tbody></table>`;
}

function pricingNoteHTML(input: PrintQuoteInput, internal: boolean): string {
  const pricingNote = input.lineItems.find((i) => i.category === "Pricing Note");
  if (!pricingNote) return "";
  return internal
    ? `<div class="diy-box"><strong style="display:block;margin-bottom:4px;">Pricing Note (internal reminder):</strong>${esc(pricingNote.description)}</div>`
    : `<div class="diy-box">${esc(pricingNote.description)}</div>`;
}

// ── Internal Job Sheet (crew detail — includes findings/remediation) ──────────
export function buildInternalJobSheetHTML(input: PrintQuoteInput): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const scoreColor = scoreColorFor(input.assessment.conditionScore);
  const sevStyle = (s: string) => {
    if (s === "high") return { bg: "hsl(8 80% 94%)", color: "hsl(8 72% 38%)", label: "High" };
    if (s === "medium") return { bg: "hsl(38 90% 93%)", color: "hsl(32 75% 32%)", label: "Medium" };
    if (s === "recommended") return { bg: "#EDF7FC", color: "#3AA8D4", label: "Recommended" };
    return { bg: "#EDF7FC", color: "#3AA8D4", label: "Low" };
  };
  const findingsHTML = input.findings
    .map((f) => {
      const st = sevStyle(f.severity);
      const rem = f.remediation || f.professionalApproach || "";
      return `<tr>
    <td style="padding:10px 12px;font-size:13px;font-weight:600;vertical-align:top;width:22%;">${esc(f.area)}<br/><span style="display:inline-block;margin-top:4px;padding:2px 7px;border-radius:12px;font-size:10px;font-weight:700;text-transform:uppercase;background:${st.bg};color:${st.color};">${st.label}</span></td>
    <td style="padding:10px 12px;vertical-align:top;"><div style="font-size:12px;color:#111827;margin-bottom:6px;">${esc(f.issue)}</div>${rem ? `<div style="font-size:11px;color:#4b5563;line-height:1.6;border-top:1px solid #e5e7eb;padding-top:6px;margin-top:4px;"><strong style="color:#374151;">Remediation:</strong> ${esc(rem)}</div>` : ""}</td>
  </tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Internal Job Sheet &mdash; ${esc(input.propertyAddress)}</title>
  <style>${reportStyles(scoreColor)}</style></head>
  <body><div class="page">
  ${headerHTML(input, "Internal Job Sheet &mdash; Crew Detail", "Report Date", date)}
  <div style="background:#fee2e2;border:1.5px solid #fca5a5;border-radius:8px;padding:10px 14px;margin-bottom:20px;font-size:12px;font-weight:700;color:#991b1b;text-transform:uppercase;letter-spacing:0.03em;">Internal Use Only &mdash; Do Not Send To Client</div>
  ${propertyContactHTML(input)}
  ${summaryHTML(input)}
  ${input.findings.length > 0 ? `<div class="section-title">Assessment Findings</div><table><thead><tr><th style="width:22%;">Area / Priority</th><th>Issue &amp; Remediation Detail</th></tr></thead><tbody>${findingsHTML}</tbody></table>` : ""}
  ${buildPhotosHTML(input.photoUrls)}
  <div class="section-title">Recommended Services &amp; Quote</div>
  ${pricingNoteHTML(input, true)}
  ${totalsTableHTML(input)}
  ${SERVICE_NOTES_HTML}
  <div class="footer"><span>Rinse It Off &middot; Fresh Rinse LLC &middot; Tigard, OR &middot; rinseitoff.com</span><span>Generated ${date}</span></div>
  </div></body></html>`;
}

// ── Client-facing Quote (price/scope only — no remediation detail) ────────────
export function buildClientQuoteHTML(input: PrintQuoteInput): string {
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const scoreColor = scoreColorFor(input.assessment.conditionScore);

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Quote &mdash; ${esc(input.propertyAddress)}</title>
  <style>${reportStyles(scoreColor)}</style></head>
  <body><div class="page">
  ${headerHTML(input, "Service Quote", "Quote Date", date)}
  ${propertyContactHTML(input)}
  ${summaryHTML(input)}
  ${buildPhotosHTML(input.photoUrls)}
  <div class="section-title">Recommended Services &amp; Quote</div>
  ${pricingNoteHTML(input, false)}
  ${totalsTableHTML(input)}
  ${SERVICE_NOTES_HTML}
  <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:10px;padding:16px;margin-bottom:28px;"><p style="font-size:12px;color:#0369a1;font-weight:600;margin-bottom:8px;">Client Authorization</p><p style="font-size:12px;color:#0c4a6e;line-height:1.7;">By signing below, you authorize Rinse It Off to perform the services listed above and agree to the stated pricing.</p><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-top:20px;">${["Authorized Signature", "Printed Name", "Date"].map((l) => `<div><div style="border-bottom:1px solid #94a3b8;height:32px;"></div><div style="font-size:10px;color:#94a3b8;margin-top:4px;">${l}</div></div>`).join("")}</div></div>
  <div class="footer"><span>Rinse It Off &middot; Fresh Rinse LLC &middot; Tigard, OR &middot; rinseitoff.com</span><span>Generated ${date}</span></div>
  </div></body></html>`;
}
