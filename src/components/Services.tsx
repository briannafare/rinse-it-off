"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { ArrowRight, Building2, Layers, Store, LayoutGrid, AppWindow, Home } from "lucide-react";

const SERVICES = [
  {
    num: "01",
    Icon: Building2,
    accent: "#62C4EB",
    glow: "rgba(98,196,235,0.22)",
    title: "Building Washing",
    desc: "Exterior cleaning for commercial facades, siding, and customer-facing building surfaces.",
  },
  {
    num: "02",
    Icon: Layers,
    accent: "#FFDBB0",
    glow: "rgba(255,219,176,0.22)",
    title: "Parking Lots & Flatwork",
    desc: "Hot water and surface cleaning for sidewalks, loading zones, dumpster areas, and entry concrete.",
  },
  {
    num: "03",
    Icon: Store,
    accent: "#62C4EB",
    glow: "rgba(98,196,235,0.22)",
    title: "Storefront Cleaning",
    desc: "Keep customer-facing locations cleaner, sharper, and more professional.",
  },
  {
    num: "04",
    Icon: LayoutGrid,
    accent: "#FFDBB0",
    glow: "rgba(255,219,176,0.22)",
    title: "HOA & Multi-Unit",
    desc: "Recurring exterior cleaning for shared spaces, breezeways, common walkways, and building exteriors.",
  },
  {
    num: "05",
    Icon: AppWindow,
    accent: "#4DFFA6",
    glow: "rgba(77,255,166,0.22)",
    title: "Window Cleaning",
    desc: "Exterior window cleaning for commercial and residential properties.",
  },
  {
    num: "06",
    Icon: Home,
    accent: "#4DFFA6",
    glow: "rgba(77,255,166,0.22)",
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

        {/* Header */}
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

        {/* Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES.map(({ num, Icon, accent, glow, title, desc }) => (
            <div
              key={num}
              className="group bg-white rounded-[2rem] border border-border-light overflow-hidden shadow-soft hover:shadow-soft-md hover:border-brand-blue/20 transition-all duration-300 cursor-default"
            >
              {/* Visual zone — dark with dot grid, radial glow, and icon */}
              <div className="relative h-40 bg-brand-dark overflow-hidden">
                {/* Dot grid — same pattern used in CTA + Differentiators */}
                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                {/* Accent radial glow behind icon */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-60 group-hover:opacity-90"
                  style={{
                    background: `radial-gradient(ellipse 70% 80% at 50% 65%, ${glow}, transparent)`,
                  }}
                />
                {/* Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Icon
                    className="w-11 h-11 transition-transform duration-500 group-hover:scale-110"
                    style={{ color: accent }}
                    strokeWidth={1.5}
                  />
                </div>
                {/* Service number — top left */}
                <span className="absolute top-4 left-5 text-[10px] font-mono text-white/20 tracking-widest">
                  {num}
                </span>
              </div>

              {/* Text content */}
              <div className="p-6 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <h3
                    className="font-display font-bold text-text-primary leading-snug"
                    style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)", letterSpacing: "-0.02em" }}
                  >
                    {title}
                  </h3>
                  <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full border border-border-light flex items-center justify-center text-text-muted group-hover:bg-brand-blue group-hover:border-brand-blue group-hover:text-white transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
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
