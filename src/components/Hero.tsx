"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import { ArrowRight, Phone } from "lucide-react";

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const els = wrapRef.current.querySelectorAll("[data-hero]");
    gsap.fromTo(els,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  return (
    <section className="relative h-[100dvh] min-h-[700px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={IMG.hero}
          alt="Rinse It Off crew pressure washing a commercial parking area with a surface cleaner in Portland, Oregon"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content — starts well below the full-width navbar (which is ~72px) */}
      <div ref={wrapRef} className="absolute inset-0 flex flex-col justify-end container-site pb-16 md:pb-24 lg:pb-28">
        <div className="max-w-3xl">
          <p data-hero className="text-white/50 text-sm font-mono tracking-wide mb-6">
            Commercial &amp; Residential Pressure Washing — Portland, OR
          </p>

          <h1 data-hero className="font-display font-bold text-white leading-[1.05] mb-7"
              style={{ fontSize: "clamp(2.4rem, 6.5vw, 4.8rem)", letterSpacing: "-0.03em" }}>
            Commercial exterior cleaning<br className="hidden sm:block" /> for Portland properties{" "}
            <span className="relative inline-block">
              <span className="relative z-10">that need to look</span>
            </span>{" "}
            <span className="font-serif font-normal italic text-brand-blue">sharp year-round.</span>
          </h1>

          <p data-hero className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-4">
            Hot water pressure washing, soft washing, window cleaning, and recurring maintenance programs for storefronts, office buildings, HOAs, industrial sites, multi-unit properties, and homes across Portland metro.
          </p>

          <p data-hero className="text-white/40 text-sm md:text-base max-w-lg leading-relaxed mb-8 font-mono tracking-wide">
            We assess the property first, then match the cleaning method to the surface, the buildup, and the maintenance goal.
          </p>

          <div data-hero className="flex flex-wrap items-center gap-4">
            <a href="#contact" className="group inline-flex items-center gap-2 bg-white text-brand-black font-bold text-sm px-7 py-3.5 rounded-full shadow-[0_4px_24px_rgba(77,255,166,0.4),0_0_60px_rgba(77,255,166,0.15)] hover:shadow-[0_4px_32px_rgba(77,255,166,0.55),0_0_80px_rgba(77,255,166,0.2)] transition-all duration-300">
              Get a Free Property Assessment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="tel:+15037043755" className="inline-flex items-center gap-2 text-white/70 font-medium text-sm hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              Call (503) 704-3755
            </a>
          </div>

          <div data-hero className="mt-4">
            <a href="#gallery" className="text-white/30 text-xs font-mono tracking-widest uppercase hover:text-white/60 transition-colors">
              See Before &amp; After Results →
            </a>
          </div>

          <div data-hero className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-[13px] text-white/35">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-mint/60" />
              Licensed &amp; Insured
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-mint/60" />
              Hot &amp; Cold Water Systems
            </span>
            <span className="flex items-center gap-2 hidden sm:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-mint/60" />
              Serving Portland Metro
            </span>
            <span className="flex items-center gap-2 hidden sm:flex">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-mint/60" />
              Commercial &amp; Residential
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/10">
        <div className="w-px h-6 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </section>
  );
}
