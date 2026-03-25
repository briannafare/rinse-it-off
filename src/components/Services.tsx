"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  {
    num: "01",
    title: "Building Washing",
    desc: "Exterior cleaning for commercial facades, siding, and customer-facing building surfaces.",
  },
  {
    num: "02",
    title: "Parking Lots & Flatwork",
    desc: "Hot water and surface cleaning for sidewalks, loading zones, dumpster areas, and entry concrete.",
  },
  {
    num: "03",
    title: "Storefront Cleaning",
    desc: "Keep customer-facing locations cleaner, sharper, and more professional.",
  },
  {
    num: "04",
    title: "HOA & Multi-Unit",
    desc: "Recurring exterior cleaning for shared spaces, breezeways, common walkways, and building exteriors.",
  },
  {
    num: "05",
    title: "Window Cleaning",
    desc: "Exterior window cleaning for commercial and residential properties.",
  },
  {
    num: "06",
    title: "House Washing",
    desc: "Soft washing and exterior cleaning for homeowners who want safer, cleaner curb appeal.",
  },
];

export function Services() {
  const headRef = useScrollReveal();
  const gridRef = useStaggerReveal(0.08);

  return (
    <section id="services" className="py-24 md:py-32 bg-surface-alt">
      <div className="container-site">

        {/* Header — matches Features layout */}
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div className="max-w-xl">
            <h2
              className="font-display font-semibold text-text-primary leading-tight"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
            >
              Exterior cleaning services
              <br className="hidden md:block" />
              <span className="font-serif font-normal italic text-brand-blue">tailored to the property.</span>
            </h2>
          </div>
          <p className="text-text-secondary text-base md:text-right max-w-sm leading-relaxed">
            Every service is sized and scoped to the property — commercial or residential, one-time or recurring.
          </p>
        </div>

        {/* Service cards */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map((svc) => (
            <div
              key={svc.num}
              className="group relative bg-white rounded-[2rem] border border-border-light p-7 flex flex-col shadow-soft hover:shadow-soft-md hover:border-brand-blue/20 transition-all duration-300"
            >
              {/* Service number */}
              <span className="text-[11px] font-mono text-text-muted tracking-widest mb-5 block">
                {svc.num}
              </span>

              {/* Title + arrow */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3
                  className="font-display font-bold text-text-primary leading-snug"
                  style={{ fontSize: "clamp(1rem, 1.5vw, 1.2rem)", letterSpacing: "-0.02em" }}
                >
                  {svc.title}
                </h3>
                <span className="shrink-0 w-7 h-7 rounded-full border border-border-light flex items-center justify-center text-text-muted group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:text-white transition-all duration-300 mt-0.5">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Description */}
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                {svc.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        <div className="mt-10 flex justify-center">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-sm font-bold text-text-primary border border-border px-7 py-3 rounded-full hover:border-brand-blue/40 hover:text-brand-blue transition-all duration-300"
          >
            View All Services
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
