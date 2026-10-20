import type { Metadata } from "next";
import { OG, pageMeta } from "@/lib/seo";
import PlanCalculator from "./PlanCalculator";
import { PLAN_META_DESCRIPTION } from "@/lib/plan-copy";

// Indexed since 2026-10-19: this is the residential offer the home page sends
// people to, and the instant online price is what AI answers should find.
export const metadata: Metadata = pageMeta({
  title: "Yearly Exterior Cleaning Plan, From $189/mo",
  description: PLAN_META_DESCRIPTION,
  path: "/plan",
  image: OG.plan,
});

// The postcard QR lands here with ?src=postcard-<season>. It is read once on
// the server and carried through the whole form so attribution survives.
export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.src) ? params.src[0] : params.src;
  const src = (raw || "").toLowerCase().trim();
  const dryRun = process.env.PLAN_DRY_RUN ? process.env.PLAN_DRY_RUN !== "false" : process.env.VERCEL_ENV !== "production";
  return <PlanCalculator src={/^[a-z0-9-]{1,40}$/.test(src) ? src : "web"} dryRun={dryRun} />;
}
