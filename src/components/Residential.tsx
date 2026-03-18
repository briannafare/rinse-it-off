"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import { ArrowUpRight } from "lucide-react";

const RESIDENTIAL = [
  { title: "House Washing", desc: "Low-pressure soft washing safely removes algae, mildew, and atmospheric grime from vinyl, wood, and painted siding.", img: IMG.driveway },
  { title: "Roof & Gutter Cleaning", desc: "Moss treatment, debris clearing, and gutter flushing that extends your roof's lifespan and prevents water damage.", img: IMG.walkway },
  { title: "Driveway & Concrete Cleaning", desc: "Hot water pressure washing strips oil stains, moss, and years of buildup from concrete, pavers, and stone.", img: IMG.curb },
  { title: "Deck & Fence Restoration", desc: "Wood-safe cleaning that removes gray weathering and green growth without stripping or splintering.", img: IMG.patio },
  { title: "Window Washing", desc: "Pure water reverse osmosis system delivers streak-free, spot-free results on interior and exterior glass.", img: IMG.breezeway },
];

export function Residential() {
  const headRef = useScrollReveal();
  const listRef = useStaggerReveal(0.08);

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-site">
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="font-display font-extrabold text-display-lg text-text-primary max-w-md leading-tight">
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
              <div className="col-span-2 md:col-span-1">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden">
                  <img src={svc.img} alt={svc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
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
