import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OG, pageMeta } from "@/lib/seo";

// The one-time home cleaning page. The yearly plan has /plan; this is the door for
// everyone who wants one cleaning (Bri, 2026-11-10: "The membership should not be
// the only way people can get service").
export const metadata: Metadata = pageMeta({
  title: "Book a One-Time House Cleaning in Portland",
  description:
    "Gutters, roof moss, house wash, driveway, windows, deck or fence, one time. Pick a time for a free look at the house, or get a rough price by text.",
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
