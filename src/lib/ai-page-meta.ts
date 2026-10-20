import type { Metadata } from "next";
import { isPublishable, type AiPage } from "@/lib/ai-pages";
import { OG, pageMeta } from "@/lib/seo";

/** Search titles and descriptions for the AI-search pieces. The frontmatter
 *  titles (80-115 characters) stay as the social-card title and in llms.txt;
 *  search results cut off near 60 and 155, so these are the short forms. */
const SEARCH: Record<string, { title: string; description?: string }> = {
  "/blog/house-washing-cost-portland": { title: "House Washing Cost in Portland (2026 Prices)" },
  "/blog/how-often-wash-a-portland-house": { title: "How Often to Wash a House in Portland" },
  "/blog/roof-moss-removal-cost-and-method": {
    title: "Roof Moss Removal in Portland: Cost & Method",
    description:
      "What roof moss removal costs in the Portland area, whether moss damages a roof, and the methods that don't hurt asphalt shingles. Checked 2026-10-19.",
  },
  "/blog/soft-wash-vs-pressure-wash": {
    title: "Soft Wash vs Pressure Wash for Your House",
    description:
      "Soft washing vs pressure washing: which method suits vinyl, cedar, stucco, brick, concrete and asphalt shingles, and what can damage siding.",
  },
  "/compare/subscription-vs-one-off-pressure-washing": {
    title: "Is a Pressure Washing Subscription Worth It?",
    description:
      "When a yearly exterior cleaning plan beats booking a company once, with Portland-area prices and the arithmetic behind them. Checked 2026-10-19.",
  },
  "/compare/rinse-it-off-vs-diy-rented-pressure-washer": {
    title: "Rent a Pressure Washer or Hire a Pro?",
    description:
      "What a rented pressure washer costs for a day, what can go wrong on siding and roofs, and when renting is the right call. Checked 2026-10-19.",
  },
  "/commercial/hiring-a-pressure-washing-company": {
    title: "How to Hire a Pressure Washing Contractor",
    description:
      "What Oregon property managers and HOA boards should check before hiring an exterior cleaning contractor: insurance, licensing, wash water and the contract.",
  },
};

/** Metadata for an AI-search piece: canonical at its own URL, and noindex while
 *  any [CONFIRM] or [EDITOR] marker is still in the copy. */
export function aiPageMetadata(page: AiPage): Metadata {
  const short = SEARCH[page.path];
  const meta = pageMeta({
    title: short?.title ?? page.title,
    shareTitle: page.title,
    description: short?.description ?? page.description,
    path: page.path,
    image: page.kind === "commercial" ? OG.commercial : OG.blog,
    type: "article",
    publishedTime: page.checked,
    modifiedTime: page.checked,
  });
  return isPublishable(page) ? meta : { ...meta, robots: { index: false, follow: false } };
}
