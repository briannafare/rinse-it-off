"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { IMG } from "@/lib/images";

export function Philosophy() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const line1Ref = useRef<HTMLParagraphElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !imgRef.current) return;

    // Parallax on background image
    gsap.to(imgRef.current, {
      y: -80,
      ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });

    // Word-by-word reveal for line 1
    if (line1Ref.current) {
      const words = line1Ref.current.querySelectorAll("span");
      gsap.fromTo(words,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power3.out",
          scrollTrigger: { trigger: line1Ref.current, start: "top 80%", once: true } }
      );
    }

    // Line 2 — the big statement
    if (line2Ref.current) {
      const words = line2Ref.current.querySelectorAll("span");
      gsap.fromTo(words,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: line2Ref.current, start: "top 80%", once: true } }
      );
    }
  }, []);

  const wrapWords = (text: string, className = "") =>
    text.split(" ").map((word, i) => (
      <span key={i} className={`inline-block mr-[0.3em] ${className}`}>{word}</span>
    ));

  return (
    <section ref={sectionRef} className="relative py-32 md:py-44 overflow-hidden bg-brand-dark">
      {/* Background image — low opacity, parallaxed */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={imgRef}
          src={IMG.portland}
          alt=""
          className="w-full h-[120%] object-cover opacity-[0.08] -mt-[10%]"
        />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="container-site relative z-10 max-w-4xl">
        {/* Neutral statement */}
        <p ref={line1Ref} className="text-white/40 text-lg md:text-xl leading-relaxed mb-8">
          {wrapWords("Most exterior cleaning companies focus on speed and volume. Get in, blast everything, move on. Your property is just another line item.")}
        </p>

        {/* Bold counter-statement */}
        <h2 ref={line2Ref} className="leading-[1.05] mb-10"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {wrapWords("We focus on", "font-display font-extrabold text-white")}
          <span className="inline-block mr-[0.3em] font-serif font-normal italic text-brand-mint">precision,</span>
          {wrapWords("protection, and making sure your", "font-display font-extrabold text-white")}
          <span className="inline-block mr-[0.3em] font-serif font-normal italic text-brand-blue">property</span>
          {wrapWords("outlasts the weather.", "font-display font-extrabold text-white")}
        </h2>

        {/* Anchor */}
        <div className="flex items-center gap-3 text-white/25 text-sm font-mono">
          <span className="w-8 h-px bg-brand-mint/30" />
          Rinse It Off — Portland, OR
        </div>
      </div>
    </section>
  );
}
