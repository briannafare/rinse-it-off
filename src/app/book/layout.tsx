import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OG, pageMeta } from "@/lib/seo";

// One-time cleaning: see what a house your size usually runs, then book a free quote
// visit or the cleaning itself (Bri 2026-11-10: "The membership should not be the only
// way people can get service").
export const metadata: Metadata = pageMeta({
  title: "Book a One-Time House Cleaning in Portland",
  description:
    "Roof moss, house wash, gutters, driveway, windows, deck or fence. See what a house your size usually runs, then book a free quote visit or the cleaning.",
  path: "/book",
  image: OG.plan,
});

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
