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
    gsap.to(imgRef.current, {
      y: -80, ease: "none",
      scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true },
    });
    if (line1Ref.current) {
      const words = line1Ref.current.querySelectorAll("span");
      gsap.fromTo(words, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out",
        scrollTrigger: { trigger: line1Ref.current, start: "top 82%", once: true } });
    }
    if (line2Ref.current) {
      const words = line2Ref.current.querySelectorAll("span");
      gsap.fromTo(words, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out",
        scrollTrigger: { trigger: line2Ref.current, start: "top 82%", once: true } });
    }
  }, []);

  const w = (text: string, cls = "") =>
    text.split(" ").map((word, i) => <span key={i} className={`inline-block mr-[0.3em] ${cls}`}>{word}</span>);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-44 overflow-hidden bg-brand-dark">
      <div className="absolute inset-0 overflow-hidden">
        <img ref={imgRef} src={IMG.portland} alt="" className="w-full h-[120%] object-cover opacity-[0.07] -mt-[10%]" />
      </div>
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="container-site relative z-10 max-w-4xl">
        <p ref={line1Ref} className="text-white/40 text-lg md:text-xl leading-relaxed mb-8">
          {w("Most pressure washing companies in Portland treat every surface the same way. One pressure setting, one nozzle, one speed. Your property is just another invoice.")}
        </p>
        <h2 ref={line2Ref} className="leading-[1.05] mb-10" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {w("We match", "font-display font-bold text-white")}
          <span className="inline-block mr-[0.3em] font-serif font-normal italic text-brand-lavender">every method</span>
          {w("to the surface. Hot water where it matters. Soft wash where it counts. And a", "font-display font-bold text-white")}
          <span className="inline-block mr-[0.3em] font-serif font-normal italic text-brand-peach-warm">maintenance plan</span>
          {w("that keeps Portland weather from winning.", "font-display font-bold text-white")}
        </h2>
        <div className="flex items-center gap-3 text-white/25 text-sm font-mono">
          <span className="w-8 h-px bg-brand-mint/30" />
          164 days of rain per year. Your building feels every one.
        </div>
      </div>
    </section>
  );
}
