/** Commercial page copy that is used twice: on /commercial and in the
 *  FAQPage / Service JSON-LD for that page. One source, so the markup can
 *  never say something the page does not. Plain module (no "use client"). */

export const COMMERCIAL_META_DESCRIPTION =
  "Rinse It Off cleans commercial properties across the Portland metro — parking lots, trash pads, storefronts, siding and roofs. Start with a free 21-point property audit and a firm, itemized quote the same day we walk your property. Insured, with recurring maintenance plans.";

export const AUDIT_LEAD =
  "Before we quote a dollar, we walk your property and document every surface that needs attention — photographed, point by point. You get a board-ready report and a firm, itemized quote the same day we walk your property. No guessing, no surprise line items.";

export const AUDIT_POINTS = [
  "Every surface walked and photo-documented",
  "The right method matched to each surface — no over-pressuring",
  "A board-ready report you can hand to ownership",
  "A firm, itemized quote the same day we walk your property",
];

export const AUDIENCES: { key: string; title: string; body: string }[] = [
  {
    key: "managers",
    title: "Property managers",
    body: "One vendor for the whole portfolio, scheduled around your tenants, with photo reports you can forward straight to ownership.",
  },
  {
    key: "hoa",
    title: "HOAs & community boards",
    body: "Common areas, clubhouses, sidewalks and monument signage kept consistent — with documentation ready for the board packet.",
  },
  {
    key: "facilities",
    title: "Facilities & operations",
    body: "Loading docks, trash pads and drive-throughs degreased on a schedule that keeps sites safe and inspection-ready.",
  },
  {
    key: "retail",
    title: "Retail & multifamily",
    body: "Storefronts, walkways and building faces that stay presentable — because curb appeal is the first thing a customer or resident sees.",
  },
];

export const TRUST: { key: string; title: string; body: string }[] = [
  {
    key: "insured",
    title: "Fully insured",
    body: "We carry full general liability and workers’ compensation coverage, and we’re glad to share proof before we start — ready whenever your team asks.",
  },
  {
    key: "method",
    title: "Method-matched, always",
    body: "Soft wash on siding and roofs, hot water on grease, high-volume flow on masonry. We match the method to the material, every time.",
  },
  {
    key: "recurring",
    title: "Recurring maintenance plans",
    body: "Monthly, quarterly and seasonal plans keep moss, algae and grime from ever getting a foothold. Set the schedule once — we handle the rest.",
  },
];

export const COMMERCIAL_CTA_BODY =
  "Book your free 21-point property audit and get a firm, itemized quote the same day we walk your property. Backed by our Clean Water Promise: we re-rinse anything you’re not happy with, free, within 48 hours.";

/** The method keys the page features, in page order (see METHODS in methods.ts). */
export const COMMERCIAL_METHOD_KEYS = ["flatwork", "grease", "siding", "glass", "masonry", "roof"];

/** Question and answer pairs for FAQPage markup on /commercial. Every answer
 *  is text printed on the page (constants above). */
export const COMMERCIAL_FAQ: { q: string; a: string }[] = [
  { q: "What is the free 21-point property audit?", a: AUDIT_LEAD },
  { q: "Are you insured for commercial work?", a: TRUST[0].body },
  { q: "Do you offer recurring maintenance plans for commercial properties?", a: TRUST[2].body },
  { q: "How do you decide which cleaning method to use?", a: TRUST[1].body },
  { q: "Who do you work with on commercial properties?", a: AUDIENCES.map((a) => `${a.title}: ${a.body}`).join(" ") },
  { q: "What if I am not happy with the result?", a: COMMERCIAL_CTA_BODY.split("Backed by our Clean Water Promise: ")[1].replace(/^we/, "We") },
];
