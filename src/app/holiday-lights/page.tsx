import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HolidayLights } from "@/components/HolidayLights";
import { pageMeta } from "@/lib/seo";

// Holiday lights moved off the home page into their own page (SuperMe website panel, 2026-10-28).
export const metadata: Metadata = pageMeta({
  title: "Holiday Light Installation",
  description: "We put up your holiday lights, take them down after the season, and you never climb a ladder.",
  path: "/holiday-lights",
});

export default function HolidayLightsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <HolidayLights />
      </main>
      <Footer />
    </>
  );
}
