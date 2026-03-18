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
    <section className="relative h-[100dvh] min-h-[640px] overflow-hidden">
      {/* Background — real job photo: surface cleaner with steam */}
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

      {/* Content — bottom-left third */}
      <div ref={wrapRef} className="absolute inset-0 flex flex-col justify-end container-site pb-16 md:pb-24 lg:pb-28">
        <div className="max-w-3xl">
          <p data-hero className="text-white/50 text-sm font-mono tracking-wide mb-5">
            Commercial &amp; Residential Pressure Washing — Portland, OR
          </p>

          <h1 data-hero className="font-display font-extrabold text-white leading-[0.92] mb-6"
              style={{ fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)", letterSpacing: "-0.03em" }}>
            We Make<br />
            <span className="relative inline-block">
              <span className="relative z-10">Dirty</span>
              <svg className="absolute -bottom-1 left-0 w-full h-3 z-0" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M2 8 C40 3, 80 10, 120 5 S180 9, 198 6" stroke="#4DFFA6" strokeWidth="3" strokeLinecap="round" fill="none" />
              </svg>
            </span>{" "}
            Buildings<br />
            <span className="font-serif font-normal italic text-brand-blue">Clean.</span>
          </h1>

          <p data-hero className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed mb-8">
            Hot water pressure washing, soft washing, and recurring maintenance programs for commercial properties across Portland metro.
          </p>

          <div data-hero className="flex flex-wrap items-center gap-4">
            <a href="#contact" className="group inline-flex items-center gap-2 bg-brand-mint text-brand-black font-bold text-sm px-7 py-3.5 rounded-full shadow-glow-mint hover:shadow-glow-mint-lg hover:brightness-110 transition-all duration-300">
              Get a Free Property Assessment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="tel:+15037043755" className="inline-flex items-center gap-2 text-white/70 font-medium text-sm hover:text-white transition-colors">
              <Phone className="w-4 h-4" />
              (503) 704-3755
            </a>
          </div>

          <div data-hero className="flex items-center gap-6 mt-10 text-[13px] text-white/35">
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
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
