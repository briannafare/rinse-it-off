"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";

/** Two doors, both photographic — show the customer their world. */
const FUNNELS = [
  {
    title: "My home",
    body: "Siding, roof, gutters, driveway, deck. Protect the surfaces that cost the most to replace — and get a firm quote today, not a site-visit runaround.",
    cta: "Start my quote",
    href: "/assessment",
    img: "/brand/photos/walkway-cleaner.jpg",
    alt: "A home's walkway half-cleaned, bright grass beside it",
  },
  {
    title: "My property portfolio",
    body: "Offices, HOAs, retail, multifamily. Start with a free photo-documented 21-point audit — the report that makes you look good to ownership.",
    cta: "Book a free property audit",
    href: "/assessment",
    img: "/brand/photos/walkway-split.jpg",
    alt: "A commercial clubhouse walkway mid-clean, the machine in the foreground",
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
            className="group relative flex h-[440px] flex-col justify-end overflow-hidden rounded-3xl border border-[#E4ECF1] p-8 md:h-[500px] md:p-10"
          >
            <Image
              src={f.img}
              alt={f.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5 transition-opacity duration-500 group-hover:opacity-90" />
            <div className="relative">
              <h2
                className="text-3xl font-medium text-white md:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.title}
              </h2>
              <p className="mt-3 max-w-md text-white/80">{f.body}</p>
              <span
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0C1215] transition-colors duration-300 group-hover:bg-[#62C4EB]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {f.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
