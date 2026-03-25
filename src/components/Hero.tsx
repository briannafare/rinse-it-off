"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import { ArrowRight, Phone } from "lucide-react";

const TRUST_ITEMS = [
  "Licensed & Insured",
  "Hot & Cold Water Systems",
  "Serving Portland Metro",
  "Commercial & Residential",
];

// Repeat enough times for a seamless infinite loop
const MARQUEE_ITEMS = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS];

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    const els = wrapRef.current.querySelectorAll("[data-hero]");
    gsap.fromTo(els,
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, stagger: 0.11, ease: "power3.out", delay: 0.25 }
    );
  }, []);

  return (
    <section className="relative h-[100dvh] min-h-[600px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={IMG.hero}
          alt="Rinse It Off crew pressure washing a commercial parking area with a surface cleaner in Portland, Oregon"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content — centered column */}
      <div
        ref={wrapRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 sm:px-8"
      >
        <div className="w-full max-w-[700px]">

          {/* Eyebrow */}
          <p data-hero className="text-white/45 text-[11px] font-mono tracking-widest uppercase mb-5">
            Commercial &amp; Residential Exterior Cleaning — Portland Metro
          </p>

          {/* Headline */}
          <h1
            data-hero
            className="font-display font-bold text-white leading-[1.05] mb-5"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)", letterSpacing: "-0.03em" }}
          >
            Exterior cleaning that keeps<br className="hidden sm:block" /> Portland properties{" "}
            <span className="font-serif font-normal italic text-brand-blue">looking sharp.</span>
          </h1>

          {/* Subheadline */}
          <p
            data-hero
            className="text-white/60 text-base md:text-[1.05rem] leading-relaxed mx-auto mb-8"
            style={{ maxWidth: "580px" }}
          >
            Pressure washing, soft washing, window cleaning, and recurring maintenance for commercial properties and homes.
          </p>

          {/* CTAs */}
          <div data-hero className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <a
              href="#contact"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-brand-black font-bold text-sm px-7 py-3.5 rounded-full shadow-[0_4px_24px_rgba(77,255,166,0.4),0_0_60px_rgba(77,255,166,0.15)] hover:shadow-[0_4px_32px_rgba(77,255,166,0.55),0_0_80px_rgba(77,255,166,0.2)] transition-all duration-300"
            >
              Free Property Assessment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="tel:+15037043755"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white/75 text-sm font-medium border border-white/20 px-7 py-3.5 rounded-full hover:text-white hover:border-white/40 transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              Call (503) 704-3755
            </a>
          </div>

        </div>
      </div>

      {/* Scrolling trust bar — pinned to bottom of hero, above the fold */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/40 backdrop-blur-sm py-4 overflow-hidden">
        <div className="flex animate-scroll-x text-white/40 text-[11px] font-medium tracking-widest uppercase">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-3 whitespace-nowrap px-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-mint/60 shrink-0" />
              {item}
            </span>
          ))}
        </div>
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
