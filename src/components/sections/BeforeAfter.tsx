"use client";
import { useState, useRef, useCallback } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { motion } from "framer-motion";

export function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(3, Math.min(97, x)));
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDragging.current) updatePosition(e.clientX); };
  const handleTouchMove = (e: React.TouchEvent) => { updatePosition(e.touches[0].clientX); };

  return (
    <section className="section-gap bg-surface-alt relative overflow-hidden">
      <div className="container-site">
        <div className="grid md:grid-cols-2 gap-8 mb-12 items-end">
          <Reveal>
            <span className="overline mb-3 block">Results</span>
            <h2 className="font-display font-extrabold text-display-lg text-text-primary">
              See the <span className="font-serif font-normal italic text-brand-blue">Difference.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-text-secondary text-lg leading-relaxed md:text-right">
              Drag to compare. This is what professional exterior cleaning actually looks like.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div
            ref={containerRef}
            className="relative w-full max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden cursor-col-resize select-none border border-border-light"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            role="slider"
            aria-label="Before and after comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
          >
            {/* BEFORE side — dark, weathered */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a3e35] via-[#4a4e45] to-[#353830]">
              {/* Grime/moss texture */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(ellipse at 15% 25%, rgba(60,80,50,0.5) 0%, transparent 50%),
                  radial-gradient(ellipse at 65% 55%, rgba(40,50,35,0.4) 0%, transparent 40%),
                  radial-gradient(ellipse at 85% 20%, rgba(50,60,40,0.3) 0%, transparent 35%),
                  radial-gradient(ellipse at 30% 75%, rgba(45,55,38,0.35) 0%, transparent 45%)`,
              }} />
              {/* Grid pattern suggesting building surface */}
              <div className="absolute inset-0 opacity-[0.06]" style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                backgroundSize: "60px 40px",
              }} />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white text-xs md:text-sm font-display font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-red-400/80" />
                  Before
                </span>
              </div>
              {/* Photo placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/[0.08] text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="10" width="40" height="28" rx="3" />
                    <circle cx="36" cy="18" r="3" />
                    <path d="M4 32L16 22L26 30L36 20L44 28" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-display">Photo placeholder</span>
                </div>
              </div>
            </div>

            {/* AFTER side — clean, bright */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#f0f4f2] via-[#f5f8f6] to-[#edf2ef]"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              {/* Clean surface pattern */}
              <div className="absolute inset-0 opacity-[0.08]" style={{
                backgroundImage: "linear-gradient(rgba(98,196,235,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(98,196,235,0.15) 1px, transparent 1px)",
                backgroundSize: "60px 40px",
              }} />
              {/* Subtle clean shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
              <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-mint/20 text-brand-black text-xs md:text-sm font-display font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-brand-mint" />
                  After
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-brand-blue/[0.10] text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="4" y="10" width="40" height="28" rx="3" />
                    <circle cx="36" cy="18" r="3" />
                    <path d="M4 32L16 22L26 30L36 20L44 28" strokeLinejoin="round" />
                  </svg>
                  <span className="text-xs font-display">Photo placeholder</span>
                </div>
              </div>
            </div>

            {/* Slider handle */}
            <div className="absolute top-0 bottom-0 z-10" style={{ left: `${position}%`, transform: "translateX(-50%)" }}>
              <div className="absolute inset-y-0 w-[2px] bg-white shadow-lg left-1/2 -translate-x-1/2" />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-brand-mint"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 text-brand-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M8 6L4 12L8 18" />
                  <path d="M16 6L20 12L16 18" />
                </svg>
              </motion.div>
            </div>
          </div>
        </Reveal>

        {/* Stats row under the slider */}
        <div className="grid grid-cols-3 gap-4 mt-8 max-w-5xl mx-auto">
          {[
            { value: "164", unit: "days", label: "of rain per year" },
            { value: "100", unit: "%", label: "satisfaction rate" },
            { value: "24/7", unit: "", label: "emergency response" },
          ].map((stat) => (
            <Reveal key={stat.label}>
              <div className="text-center py-4 rounded-2xl bg-white border border-border-light">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display font-extrabold text-2xl md:text-3xl text-text-primary">{stat.value}</span>
                  {stat.unit && <span className="font-display font-bold text-sm text-brand-mint">{stat.unit}</span>}
                </div>
                <p className="text-xs text-text-muted mt-1">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
