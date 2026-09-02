"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";

/** Two doors, equal weight. A homeowner and a property manager should each see
 *  themselves in one of these within a second of scrolling. Both photos are real
 *  RIO jobs — no stock, no AI. Keep them balanced: if one side ever gets the
 *  better photo or the longer pitch, the site tilts and the other audience leaves. */
const FUNNELS = [
  {
    title: "For my home",
    body: "Driveway, siding, roof, gutters, deck. We walk it with you, then hand you a firm price the same day, itemized so you can take part of it or all of it.",
    cta: "Get my home quote",
    href: "/assessment?type=residential",
    img: "/brand/photos/work/driveway-after.webp",
    alt: "A residential driveway in the trees, washed clean",
  },
  {
    title: "For my property",
    body: "Storefronts, offices, HOAs, multifamily, clubhouses. Start with the free 21-point audit and you get photos of every problem area, which is the part ownership actually reads.",
    cta: "Book a property audit",
    href: "/assessment?type=commercial",
    img: "/brand/photos/work/clubhouse-entry.webp",
    alt: "A clubhouse entry with the concrete freshly cleaned",
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15 transition-opacity duration-500 group-hover:opacity-90 motion-reduce:transition-none" />
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
