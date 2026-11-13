import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OG, pageMeta } from "@/lib/seo";

// One-time cleaning: type the address, pick what needs cleaning, see the price for that
// house, book a day (Bri 2026-11-10: "The membership should not be the only
// way people can get service").
export const metadata: Metadata = pageMeta({
  title: "Book a One-Time House Cleaning in Portland",
  description:
    "Roof moss, house wash, gutters, driveway and windows. Type your address and see the price for your house, then pick a day.",
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
