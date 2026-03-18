"use client";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { Home, Droplets, PaintBucket, Fence, GlassWater } from "lucide-react";

const RESIDENTIAL = [
  { title: "House Washing", desc: "Gentle soft washing that removes years of buildup without damaging siding, trim, or paint.", icon: <Home className="w-5 h-5" /> },
  { title: "Roof & Gutter Cleaning", desc: "Moss removal, gutter clearing, and preventive treatments that protect your roof's warranty.", icon: <Droplets className="w-5 h-5" /> },
  { title: "Concrete Cleaning", desc: "Driveways, patios, and walkways restored to original condition with hot water pressure washing.", icon: <PaintBucket className="w-5 h-5" /> },
  { title: "Deck & Fence Cleaning", desc: "Wood-safe cleaning that revitalizes outdoor spaces without stripping or damaging surfaces.", icon: <Fence className="w-5 h-5" /> },
  { title: "Window Washing", desc: "Crystal-clear, streak-free glass with our reverse osmosis water purification system.", icon: <GlassWater className="w-5 h-5" /> },
];

export function ResidentialServices() {
  return (
    <section className="section-gap bg-white relative overflow-hidden">
      <div className="container-site">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Left sticky header */}
          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <Reveal>
              <span className="overline mb-3 block">For Homeowners</span>
              <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-4">
                Residential
                <br />
                <span className="text-gradient-blue">Cleaning</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Your home deserves the same professional care we give commercial properties. Same equipment, same expertise, same results.
              </p>
              <a href="#contact" className="btn-outline">
                Get a Quote
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </Reveal>
          </div>

          {/* Right service list */}
          <div className="lg:col-span-3">
            <StaggerContainer className="space-y-4">
              {RESIDENTIAL.map((svc, i) => (
                <StaggerItem key={svc.title}>
                  <div className="group flex items-start gap-5 p-5 rounded-2xl border border-transparent hover:border-border-light hover:bg-surface-card transition-all duration-300 cursor-default">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-surface-blue flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      {svc.icon}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-text-primary mb-1 group-hover:text-brand-blue-dark transition-colors">
                        {svc.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{svc.desc}</p>
                    </div>
                    <div className="hidden md:flex flex-shrink-0 ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity text-brand-blue">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  {i < RESIDENTIAL.length - 1 && (
                    <div className="mx-5 border-b border-border-light" />
                  )}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
