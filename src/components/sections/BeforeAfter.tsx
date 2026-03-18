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
    setPosition(Math.max(2, Math.min(98, x)));
  }, []);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) updatePosition(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <section className="section-gap bg-surface-alt relative overflow-hidden">
      <div className="container-site">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="overline mb-3 block">See the Difference</span>
          <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-4">
            Drag to Reveal the Transformation
          </h2>
          <p className="text-text-secondary text-lg">
            Slide left and right to see what professional exterior cleaning actually looks like.
          </p>
        </Reveal>

        <Reveal>
          <div
            ref={containerRef}
            className="relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden cursor-col-resize select-none shadow-soft-lg border border-border-light"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            role="slider"
            aria-label="Before and after comparison slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
          >
            {/* "Before" side — dirty/weathered */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4a5d4a] via-[#6b7d6b] to-[#5a6b5a]">
              {/* Grime texture overlay */}
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: `radial-gradient(ellipse at 20% 30%, rgba(0,0,0,0.3) 0%, transparent 60%),
                  radial-gradient(ellipse at 70% 60%, rgba(50,70,50,0.4) 0%, transparent 50%),
                  radial-gradient(ellipse at 40% 80%, rgba(0,0,0,0.2) 0%, transparent 40%)`
              }} />
              {/* Simulated moss streaks */}
              <div className="absolute top-[10%] left-[5%] w-[30%] h-[60%] bg-gradient-to-b from-[#3d5a3d]/40 to-transparent rounded-full blur-xl" />
              <div className="absolute top-[20%] right-[15%] w-[20%] h-[40%] bg-gradient-to-b from-[#4d6a4d]/30 to-transparent rounded-full blur-lg" />
              {/* Label */}
              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 bg-black/50 backdrop-blur-sm text-white text-xs md:text-sm font-display font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-wide">
                Before
              </div>
              {/* Placeholder text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white/30">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-40" viewBox="0 0 64 64" fill="none">
                    <rect x="8" y="16" width="48" height="36" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 40L24 28L36 36L48 24L56 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="44" cy="26" r="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="text-sm font-display">Client photo placeholder</span>
                </div>
              </div>
            </div>

            {/* "After" side — clean/bright */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-[#e8f4f8] via-[#f0f8ff] to-[#e4f2f8]"
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            >
              {/* Clean shimmer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10" />
              {/* Subtle clean texture */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `linear-gradient(135deg, rgba(98,196,235,0.1) 25%, transparent 25%),
                  linear-gradient(225deg, rgba(98,196,235,0.1) 25%, transparent 25%)`,
                backgroundSize: "60px 60px",
              }} />
              {/* Label */}
              <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-brand-blue/90 backdrop-blur-sm text-white text-xs md:text-sm font-display font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-wide">
                After
              </div>
              {/* Placeholder text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-brand-blue/30">
                  <svg className="w-16 h-16 mx-auto mb-3 opacity-40" viewBox="0 0 64 64" fill="none">
                    <rect x="8" y="16" width="48" height="36" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 40L24 28L36 36L48 24L56 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="44" cy="26" r="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span className="text-sm font-display">Client photo placeholder</span>
                </div>
              </div>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 z-10"
              style={{ left: `${position}%`, transform: "translateX(-50%)" }}
            >
              {/* Vertical line */}
              <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg left-1/2 -translate-x-1/2" />
              {/* Drag handle */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border-2 border-brand-blue flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5 text-brand-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M8 6L4 12L8 18" />
                  <path d="M16 6L20 12L16 18" />
                </svg>
              </motion.div>
            </div>
          </div>
        </Reveal>

        <Reveal className="text-center mt-6">
          <p className="text-sm text-text-muted italic">
            Real before &amp; after photos coming soon — drag to preview the slider interaction
          </p>
        </Reveal>
      </div>
    </section>
  );
}
