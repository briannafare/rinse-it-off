"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";

/* Purpose-built SVG icons — each matches its service */
const icons = {
  houseWash: (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      <path d="M4 15L16 5L28 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13V26H25V13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 10V6H24V13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.4" />
      {/* Water droplets */}
      <circle cx="12" cy="20" r="1" fill="currentColor" opacity="0.5" />
      <circle cx="16" cy="22" r="1.2" fill="currentColor" opacity="0.4" />
      <circle cx="20" cy="19" r="0.8" fill="currentColor" opacity="0.5" />
    </svg>
  ),
  roofGutter: (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      {/* Roof */}
      <path d="M3 16L16 6L29 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Gutter trough */}
      <path d="M5 16H27V19H5V16Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
      {/* Downspout */}
      <path d="M25 19V27" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {/* Debris/leaves in gutter */}
      <circle cx="10" cy="17.5" r="1" fill="currentColor" opacity="0.3" />
      <circle cx="14" cy="17.5" r="0.8" fill="currentColor" opacity="0.25" />
      <circle cx="18" cy="17.5" r="1" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  concrete: (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      {/* Concrete slab grid */}
      <rect x="4" y="10" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <line x1="16" y1="10" x2="16" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <line x1="4" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      {/* Spray lines showing cleaning action */}
      <path d="M10 7L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M12 6L12 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M14 7L16 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  deckFence: (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      {/* Fence posts */}
      <rect x="5" y="8" width="3" height="18" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14.5" y="8" width="3" height="18" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="24" y="8" width="3" height="18" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
      {/* Horizontal rails */}
      <line x1="5" y1="13" x2="27" y2="13" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="5" y1="20" x2="27" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      {/* Post caps */}
      <path d="M4 8H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M13.5 8H18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M23 8H28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  ),
  window: (
    <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
      {/* Window frame */}
      <rect x="6" y="5" width="20" height="22" rx="2" stroke="currentColor" strokeWidth="1.8" />
      {/* Panes */}
      <line x1="16" y1="5" x2="16" y2="27" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      <line x1="6" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="1.2" opacity="0.4" />
      {/* Sparkle/clean shine */}
      <path d="M22 9L23 10.5L24 9L23 7.5Z" fill="currentColor" opacity="0.5" />
      <path d="M10 20L10.6 21L11.2 20L10.6 19Z" fill="currentColor" opacity="0.4" />
    </svg>
  ),
};

const RESIDENTIAL = [
  { title: "House Washing", desc: "Low-pressure soft washing safely removes algae, mildew, and atmospheric grime from vinyl, wood, and painted siding.", icon: icons.houseWash },
  { title: "Roof & Gutter Cleaning", desc: "Moss treatment, debris clearing, and gutter flushing that extends your roof's lifespan and prevents water damage.", icon: icons.roofGutter },
  { title: "Driveway & Concrete Cleaning", desc: "Hot water pressure washing strips oil stains, moss, and years of buildup from concrete, pavers, and stone.", icon: icons.concrete },
  { title: "Deck & Fence Restoration", desc: "Wood-safe cleaning that removes gray weathering and green growth without stripping or splintering.", icon: icons.deckFence },
  { title: "Window Washing", desc: "Pure water reverse osmosis system delivers streak-free, spot-free results on interior and exterior glass.", icon: icons.window },
];

export function Residential() {
  const headRef = useScrollReveal();
  const listRef = useStaggerReveal(0.08);

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-site">
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="font-display font-semibold text-display-lg text-text-primary max-w-md leading-tight">
            Residential <span className="font-serif font-normal italic text-brand-blue">Cleaning</span>
          </h2>
          <p className="text-text-secondary text-base max-w-sm md:text-right leading-relaxed">
            Same commercial-grade equipment and trained crew — scaled for homes across Portland, Lake Oswego, Beaverton, and Tigard.
          </p>
        </div>

        <div ref={listRef} className="border-t border-border">
          {RESIDENTIAL.map((svc, i) => (
            <div key={svc.title} className="group grid grid-cols-12 gap-4 py-5 md:py-7 border-b border-border-light items-center cursor-pointer hover:bg-surface-alt/50 -mx-4 px-4 md:-mx-6 md:px-6 transition-colors duration-300">
              <div className="col-span-1 hidden md:block">
                <span className="font-mono text-xs text-text-muted">0{i + 1}</span>
              </div>

              {/* Icon instead of photo */}
              <div className="col-span-2 md:col-span-1">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl bg-surface-alt border border-border-light flex items-center justify-center text-brand-blue p-2.5 group-hover:bg-brand-blue/10 group-hover:border-brand-blue/20 transition-all duration-300">
                  {svc.icon}
                </div>
              </div>

              <div className="col-span-6 md:col-span-3">
                <h3 className="font-display font-bold text-base md:text-lg text-text-primary group-hover:text-brand-blue transition-colors">{svc.title}</h3>
              </div>

              <div className="col-span-12 md:col-span-5 order-last md:order-none">
                <p className="text-sm text-text-secondary leading-relaxed">{svc.desc}</p>
              </div>

              <div className="col-span-4 md:col-span-2 flex justify-end">
                <span className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center text-text-muted group-hover:bg-brand-mint group-hover:border-brand-mint group-hover:text-brand-black transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
