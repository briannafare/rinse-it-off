"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";

/** Two doors, both photographic — show the customer their world. */
const FUNNELS = [
  {
    title: "My home",
    body: "Siding, roof, gutters, driveway, deck. We assess on-site and hand you a firm quote the same day — no runaround.",
    cta: "Start my quote",
    href: "/quote",
    img: "/brand/photos/hero-woman.webp",
    alt: "A homeowner outside her freshly rinsed home",
  },
  {
    title: "My property portfolio",
    body: "Offices, HOAs, retail, multifamily. Start with a free photo-documented 21-point audit — the report that makes you look good to ownership.",
    cta: "Book a free property audit",
    href: "/assessment?type=commercial",
    img: "/brand/photos/building-wash.webp",
    alt: "A commercial building exterior being soft-washed clean",
  },
];

export function DualFunnel() {
  const ref = useStaggerReveal(0.12);

  return (
    <section className="bg-[#F4F7F8] py-16 md:py-24">
      <div ref={ref} className="container-site grid gap-5 md:grid-cols-2 md:gap-8">
        {FUNNELS.map((f) => (
          <a
            key={f.title}
            href={f.href}
            className="group relative flex h-[440px] flex-col justify-end overflow-hidden rounded-2xl border border-[#E4ECF1] p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8] md:h-[500px] md:p-10"
          >
            <Image
              src={f.img}
              alt={f.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 transition-opacity duration-500 group-hover:opacity-90 motion-reduce:transition-none" />
            <div className="relative">
              <h2
                className="text-3xl font-medium text-white md:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.title}
              </h2>
              <p className="mt-3 max-w-md text-white/80">{f.body}</p>
              <span
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-5 py-3 text-sm font-semibold text-[#0C1215] transition-colors duration-300 group-hover:bg-[#7CD0EF] motion-reduce:transition-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
