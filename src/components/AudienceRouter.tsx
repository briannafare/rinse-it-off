"use client";
import { ArrowRight, Building2, Home } from "lucide-react";
import { useStaggerReveal, useScrollReveal } from "@/lib/gsap";

const COMMERCIAL_SERVICES = [
  "Property managers & HOAs",
  "Storefronts & office buildings",
  "Industrial & warehouse facilities",
  "Multi-unit residential complexes",
  "Parking structures & surface lots",
];

const RESIDENTIAL_SERVICES = [
  "House washing & roof soft washing",
  "Window cleaning (RO/DI purified water)",
  "Driveway, patio & walkway cleaning",
  "Gutter brightening & exterior detail",
  "Recurring maintenance plans",
];

export function AudienceRouter() {
  const headingRef = useScrollReveal();
  const cardsRef = useStaggerReveal(0.15);

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-site">

        {/* Section heading */}
        <div ref={headingRef} className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[11px] font-mono text-text-muted tracking-widest uppercase mb-4">
            Who We Serve
          </p>
          <h2
            className="font-display font-semibold text-text-primary leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            Built for Portland properties{" "}
            <span className="font-serif font-normal italic text-brand-blue">of all kinds.</span>
          </h2>
        </div>

        {/* Routing cards */}
        <div ref={cardsRef} className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">

          {/* ── Commercial (dark) ── */}
          <div className="relative rounded-[2rem] bg-brand-dark overflow-hidden flex flex-col p-8 md:p-10">
            {/* Blue top accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-blue via-brand-blue-light to-transparent" />
            {/* Dot grid texture */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            <div className="relative flex flex-col flex-1">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-7">
                <span className="w-9 h-9 rounded-xl bg-brand-blue/15 border border-brand-blue/20 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-brand-blue" />
                </span>
                <span className="text-[11px] font-mono text-brand-blue/70 tracking-widest uppercase">Commercial</span>
              </div>

              {/* Title */}
              <h3
                className="font-display font-bold text-white mb-4 leading-tight"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", letterSpacing: "-0.02em" }}
              >
                Commercial Services
              </h3>

              {/* Body */}
              <p className="text-white/50 text-[0.95rem] leading-relaxed mb-8">
                Exterior cleaning for property managers, storefronts, office buildings, HOAs, industrial sites, and multi-unit properties.
              </p>

              {/* Service list */}
              <ul className="space-y-3 mb-10 flex-1">
                {COMMERCIAL_SERVICES.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/55">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue/60 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#services"
                className="group/btn self-start inline-flex items-center gap-2 bg-white text-brand-black font-bold text-sm px-6 py-3 rounded-full hover:bg-brand-blue hover:text-white transition-all duration-300"
              >
                Explore Commercial
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* ── Residential (light) ── */}
          <div className="relative rounded-[2rem] bg-surface-mint border border-brand-mint/25 overflow-hidden flex flex-col p-8 md:p-10">
            {/* Mint top accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-mint via-brand-mint-soft to-transparent" />

            <div className="relative flex flex-col flex-1">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-7">
                <span className="w-9 h-9 rounded-xl bg-brand-mint/25 border border-brand-mint/30 flex items-center justify-center flex-shrink-0">
                  <Home className="w-4 h-4 text-emerald-600" />
                </span>
                <span className="text-[11px] font-mono text-emerald-600/70 tracking-widest uppercase">Residential</span>
              </div>

              {/* Title */}
              <h3
                className="font-display font-bold text-text-primary mb-4 leading-tight"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", letterSpacing: "-0.02em" }}
              >
                Residential Services
              </h3>

              {/* Body */}
              <p className="text-text-secondary text-[0.95rem] leading-relaxed mb-8">
                Soft washing, house washing, window cleaning, and maintenance-focused exterior cleaning for homeowners.
              </p>

              {/* Service list */}
              <ul className="space-y-3 mb-10 flex-1">
                {RESIDENTIAL_SERVICES.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-mint flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#services"
                className="group/btn self-start inline-flex items-center gap-2 bg-brand-black text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-emerald-800 transition-all duration-300 shadow-[0_0_20px_rgba(77,255,166,0.18)]"
              >
                Explore Residential
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
