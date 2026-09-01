import type { Metadata } from "next";
import PlanCalculator from "./PlanCalculator";

export const metadata: Metadata = {
  title: "Your membership price",
  description:
    "Tell us about your house and see the monthly price for a full year of exterior care in Portland: roof, siding, driveway, gutters, winter walkways, and the windows cleaned four times.",
  alternates: { canonical: "https://rinseitoff.com/plan" },
  robots: { index: false, follow: false },
};

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
  return <PlanCalculator src={/^[a-z0-9-]{1,40}$/.test(src) ? src : "web"} />;
}
