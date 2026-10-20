import type { Metadata } from "next";
import { OG, pageMeta } from "@/lib/seo";

// Indexed since 2026-10-19: every service page sends people here for the free
// assessment, and it was already in the sitemap while marked noindex.
export const metadata: Metadata = pageMeta({
  title: "Free Property Assessment in Portland",
  description:
    "We walk your property, photograph every surface that needs attention, and give you a written, itemized quote. Free, with no commitment.",
  path: "/assessment",
  image: OG.commercial,
});

export default function AssessmentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
