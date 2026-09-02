import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CITIES, NEIGHBORHOODS } from "@/lib/areas";

const BASE_URL = "https://rinseitoff.com";
const PHONE_DISPLAY = "(503) 704-3755";
const PHONE_TEL = "tel:+15037043755";

export const metadata: Metadata = {
  title: "Service Areas — Portland Metro Pressure Washing & Exterior Cleaning",
  description:
    "Rinse It Off serves homes and businesses across the Portland metro — Portland, Beaverton, Tigard, Lake Oswego, Hillsboro, Gresham, Milwaukie and dozens of Portland neighborhoods. Method-matched exterior cleaning, free property audits, Clean Water Promise.",
  alternates: { canonical: `${BASE_URL}/areas` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Rinse It Off service areas — Portland metro",
  itemListElement: [...CITIES, ...NEIGHBORHOODS].map((a, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: a.name,
    url: `${BASE_URL}/areas/${a.slug}`,
  })),
};

function AreaCard({ slug, name }: { slug: string; name: string }) {
  return (
    <li>
      <Link
        href={`/areas/${slug}`}
        className="group flex min-h-[44px] items-center justify-between gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-[#0C1215] ring-1 ring-[#E4ECF1] transition-colors hover:bg-[#EDF7FC] hover:ring-[#62C4EB]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {name}
        <ArrowUpRight className="h-4 w-4 text-[#8C9AA5] transition-colors group-hover:text-[#62C4EB]" aria-hidden />
      </Link>
    </li>
  );
}

export default function AreasIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* Hero — dark image band */}
        <section className="relative w-full overflow-hidden bg-[#0C1215]">
          <Image
            src="/brand/photos/work/surface-cleaner-steam.webp"
            alt="A Rinse It Off technician running a surface cleaner across a walkway, steam rising"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/15" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" aria-hidden />

          <div className="container-site relative z-10 flex flex-col justify-end pb-14 pt-32 md:pb-20 md:pt-40">
            <div className="max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-sm font-medium text-white/85">
                <MapPin className="h-4 w-4 text-[#62C4EB]" aria-hidden />
                Portland, Oregon &amp; the surrounding metro
              </p>
              <h1
                className="text-[clamp(2rem,5.4vw,4rem)] leading-[1.02] tracking-[-0.03em] text-white"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Where we clean — <span className="text-[#62C4EB]">metro-wide.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
                We serve homeowners and businesses across the Portland metro with method-matched
                exterior cleaning. Find your city or neighborhood below — every area gets the same
                free 21-point property audit and Clean Water Promise.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href="/assessment"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 font-semibold text-[#0C1215] shadow-[0_10px_28px_-8px_rgba(98,196,235,0.55)] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Get your free assessment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
                </a>
                <a
                  href={PHONE_TEL}
                  className="-mx-2 inline-flex min-h-[44px] items-center gap-2 rounded-lg px-2 text-sm font-semibold text-white hover:text-[#62C4EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {PHONE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Cities — the strongest pages */}
        <section className="bg-[#F4F7F8] py-16 md:py-24">
          <div className="container-site">
            <header className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-medium text-[#0C1215]">
                <span className="inline-block h-2 w-2 rounded-[3px] bg-[#62C4EB]" aria-hidden />
                Cities we serve
              </p>
              <h2
                className="mt-3 text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Portland-metro cities
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#4B5C6B]">
                Residential and commercial exterior cleaning across the metro — houses, storefronts,
                HOAs, and multi-building sites alike.
              </p>
            </header>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-10">
              {CITIES.map((a) => (
                <AreaCard key={a.slug} slug={a.slug} name={a.name} />
              ))}
            </ul>
          </div>
        </section>

        {/* Neighborhoods */}
        <section className="bg-white py-16 md:py-24">
          <div className="container-site">
            <header className="max-w-2xl">
              <p className="flex items-center gap-2 text-sm font-medium text-[#0C1215]">
                <span className="inline-block h-2 w-2 rounded-[3px] bg-[#62C4EB]" aria-hidden />
                Portland neighborhoods
              </p>
              <h2
                className="mt-3 text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Neighborhood by neighborhood
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#4B5C6B]">
                From Sellwood-Moreland to St. Johns&apos; Cathedral Park, we know how Portland&apos;s
                older homes, mature trees, and shaded lots grow moss — and how to clean it off the
                right way.
              </p>
            </header>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:mt-10">
              {NEIGHBORHOODS.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/areas/${a.slug}`}
                    className="group flex min-h-[44px] items-center justify-between gap-2 rounded-xl bg-[#F8FBFE] px-5 py-3.5 text-sm font-semibold text-[#0C1215] ring-1 ring-[#EFF4F7] transition-colors hover:bg-[#EDF7FC] hover:ring-[#62C4EB]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {a.name}
                    <ArrowUpRight className="h-4 w-4 text-[#8C9AA5] transition-colors group-hover:text-[#62C4EB]" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-[#F4F7F8] pb-20 md:pb-28">
          <div className="container-site">
            <div className="flex flex-col items-start gap-5 rounded-3xl bg-[#0C1215] p-8 md:flex-row md:items-center md:justify-between md:p-12">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold text-white md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>
                  Don&apos;t see your street?
                </h2>
                <p className="mt-2 text-white/80">
                  We cover the whole Portland metro. Call us or book a free property audit and
                  we&apos;ll confirm we&apos;re out your way.
                </p>
              </div>
              <a
                href="/assessment"
                className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215] motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Book your free property audit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
