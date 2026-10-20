"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";

/** Two doors, equal weight. A homeowner and a property manager should each see
 *  themselves in one of these within a second of scrolling. Both photos are from the
 *  staged late-60s set (2026-10-19 rebrand); real job photos carry the proof sections. Keep them balanced: if one side ever gets the
 *  better photo or the longer pitch, the site tilts and the other audience leaves. */
const FUNNELS = [
  {
    title: "For my home",
    body: "Driveway, siding, roof, gutters, deck. We walk it with you, then hand you a firm price the same day, itemized so you can take part of it or all of it.",
    cta: "Get my home quote",
    href: "/assessment?type=residential",
    img: "/brand/retro/i-home-wide.webp",
    alt: "A flat 1960s-style illustration of a cleaner washing a house's tall windows with a water-fed pole while the homeowners watch",
  },
  {
    title: "For my business",
    body: "Storefronts, offices, HOAs, multifamily, clubhouses. Start with the free 21-point audit and you get photos of every problem area, which is the part ownership actually reads.",
    cta: "Book a property audit",
    href: "/assessment?type=commercial",
    img: "/brand/retro/i-biz-wide.webp",
    alt: "A flat 1960s-style illustration of two cleaners at a mid-century storefront, one on the walkway with a surface cleaner, one on the glass",
  },
];

export function DualFunnel() {
  const ref = useStaggerReveal(0.12);

  return (
    <section className="bg-retro-paper py-16 md:py-24">
      {/* Photo on top, a flat block of color underneath: the 1967 magazine-ad layout. */}
      <div ref={ref} className="container-site grid gap-6 md:grid-cols-2 md:gap-8">
        {FUNNELS.map((f, i) => (
          <a
            key={f.title}
            href={f.href}
            className="frame group flex flex-col overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-retro-paper"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src={f.img}
                alt={f.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </div>
            <div className={`flex flex-1 flex-col p-7 md:p-9 ${i === 0 ? "bg-brand-blue text-[#0C1215]" : "bg-[#62C4EB] text-[#0C1215]"}`}>
              <h2 className="text-[2.2rem] leading-none md:text-[2.8rem]">{f.title}</h2>
              <p className={`mt-3 max-w-md ${i === 0 ? "text-[#0C1215]/90" : "text-[#0C1215]/80"}`}>{f.body}</p>
              <span
                className={`btn-print mt-6 inline-flex items-center gap-2 self-start px-5 py-3 transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none ${
                  "bg-[#F2B632] text-[#0C1215]"
                }`}
              >
                {f.cta}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
