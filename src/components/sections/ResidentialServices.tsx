"use client";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";

const RESIDENTIAL = [
  { title: "House Washing", desc: "Gentle soft washing that removes years of buildup without damaging siding, trim, or paint.", tag: "soft wash" },
  { title: "Roof & Gutter Cleaning", desc: "Moss removal, gutter clearing, and preventive treatments that protect your roof's warranty.", tag: "preventive" },
  { title: "Concrete Cleaning", desc: "Driveways, patios, and walkways restored with hot water pressure washing.", tag: "hot water" },
  { title: "Deck & Fence Cleaning", desc: "Wood-safe cleaning that revitalizes outdoor spaces without stripping or damaging surfaces.", tag: "wood-safe" },
  { title: "Window Washing", desc: "Crystal-clear, streak-free glass with our reverse osmosis water purification system.", tag: "RO water" },
];

export function ResidentialServices() {
  return (
    <section className="section-gap bg-white relative overflow-hidden">
      <div className="container-site">
        <div className="grid md:grid-cols-2 gap-8 mb-12 items-end">
          <Reveal>
            <span className="overline mb-3 block">For Homeowners</span>
            <h2 className="font-display font-extrabold text-display-lg text-text-primary">
              Residential
              <br />
              <span className="font-serif font-normal italic text-brand-blue">Cleaning</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-text-secondary text-lg leading-relaxed md:text-right">
              Your home deserves the same professional care we give commercial properties. Same equipment, same expertise, same results.
            </p>
          </Reveal>
        </div>

        {/* Editorial list rows */}
        <div className="border-t border-border">
          {RESIDENTIAL.map((svc, i) => (
            <Reveal key={svc.title} delay={i * 0.05}>
              <div className="group grid grid-cols-12 gap-4 py-6 md:py-8 border-b border-border-light items-center cursor-pointer hover:bg-surface-alt/50 -mx-4 px-4 md:-mx-6 md:px-6 transition-colors duration-300">
                {/* Number */}
                <div className="col-span-1 hidden md:block">
                  <span className="font-mono text-xs text-text-muted">0{i + 1}</span>
                </div>

                {/* Title */}
                <div className="col-span-8 md:col-span-4">
                  <h3 className="font-display font-bold text-lg md:text-xl text-text-primary group-hover:text-brand-blue transition-colors duration-300">
                    {svc.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="col-span-12 md:col-span-4 order-last md:order-none">
                  <p className="text-sm text-text-secondary leading-relaxed">{svc.desc}</p>
                </div>

                {/* Tag + Arrow */}
                <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-3">
                  <span className="pill-outline text-[10px] hidden sm:inline-flex">{svc.tag}</span>
                  <span className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center text-text-muted group-hover:bg-brand-mint group-hover:border-brand-mint group-hover:text-brand-black transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <a href="#contact" className="btn-outline">
            Get a Residential Quote
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
