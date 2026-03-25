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
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  return (
    <section className="relative h-[100dvh] min-h-[640px] overflow-hidden">
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

      <div ref={wrapRef} className="absolute inset-0 flex flex-col justify-end container-site pb-14 md:pb-20 lg:pb-24">
        <div className="max-w-3xl">
          <p data-hero className="text-white/50 text-sm font-mono tracking-wide mb-5">
            Commercial &amp; Residential Pressure Washing — Portland, OR
          </p>

          <h1 data-hero className="font-display font-bold text-white leading-[1.05] mb-6"
              style={{ fontSize: "clamp(2.2rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}>
            Commercial exterior cleaning for Portland properties that need to look{" "}
            <span className="font-serif font-normal italic text-brand-blue">sharp year-round.</span>
          </h1>

          <p data-hero className="text-white/55 text-base md:text-lg max-w-2xl leading-relaxed mb-8">
            Hot water pressure washing, soft washing, window cleaning, and recurring maintenance programs for storefronts, office buildings, HOAs, industrial sites, multi-unit properties, and homes across Portland metro.
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
        </div>
      </div>
    </section>
  );
}
