"use client";
import { motion } from "framer-motion";
import { useStaggerReveal, useScrollReveal } from "@/lib/gsap";

const CARDS = [
  {
    num: "01",
    accent: "#62C4EB",
    glow: "rgba(98,196,235,0.12)",
    border: "rgba(98,196,235,0.18)",
    tag: "Surface-specific",
    title: "The right method for the surface",
    body: "Concrete, siding, stucco, painted exteriors, storefronts, roofs, and high-traffic flatwork all require different approaches. We don't use one generic method on every job.",
  },
  {
    num: "02",
    accent: "#FFDBB0",
    glow: "rgba(255,219,176,0.12)",
    border: "rgba(255,219,176,0.18)",
    tag: "Hot & cold water",
    title: "Hot water where it matters",
    body: "Grease-heavy commercial surfaces like dumpster pads, loading areas, drive-through lanes, and entry concrete often need more than cold-water washing.",
  },
  {
    num: "03",
    accent: "#4DFFA6",
    glow: "rgba(77,255,166,0.12)",
    border: "rgba(77,255,166,0.18)",
    tag: "Pacific Northwest",
    title: "Built for Portland conditions",
    body: "Rain, shade, moss, algae, and recurring buildup are part of owning and managing property here. We clean with that reality in mind.",
  },
  {
    num: "04",
    accent: "#DBD7FF",
    glow: "rgba(219,215,255,0.12)",
    border: "rgba(219,215,255,0.18)",
    tag: "Maintenance plans",
    title: "Designed for recurring maintenance",
    body: "Many properties need more than a one-time cleanup. We build maintenance plans to help keep exteriors consistently presentable over time.",
  },
];

export function Differentiators() {
  const headingRef = useScrollReveal();
  const cardsRef = useStaggerReveal(0.12);

  return (
    <section className="relative py-24 md:py-32 bg-brand-darker overflow-hidden">

      {/* Ambient color bleed — code-generated, no images */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 20%, rgba(98,196,235,0.06) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 40% at 85% 80%, rgba(77,255,166,0.05) 0%, transparent 70%)",
        }}
      />
      {/* Dot grid texture (matches CTA section) */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="container-site relative z-10">

        {/* Heading */}
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[11px] font-mono text-white/25 tracking-widest uppercase mb-4">
            Why It Matters
          </p>
          <h2
            className="font-display font-bold text-white leading-[1.05]"
            style={{ fontSize: "clamp(1.85rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
          >
            Not all exterior cleaning
            <br className="hidden md:block" />
            <span className="font-serif font-normal italic text-brand-blue"> is the same.</span>
          </h2>
        </div>

        {/* 2×2 grid */}
        <div ref={cardsRef} className="grid sm:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {CARDS.map((card) => (
            <motion.div
              key={card.num}
              className="group relative rounded-[2rem] flex flex-col p-8 md:p-9 overflow-hidden cursor-default"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
            >
              {/* Per-card hover glow — opacity driven by CSS group-hover */}
              <div
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `inset 0 0 48px ${card.glow}, 0 0 48px ${card.glow}`, border: `1px solid ${card.border}` }}
              />

              {/* Top accent line */}
              <div
                className="absolute top-0 left-10 right-10 h-[2px] rounded-full"
                style={{ background: `linear-gradient(to right, ${card.accent}, transparent)` }}
              />

              {/* Decorative number — faint watermark */}
              <span
                aria-hidden
                className="absolute -top-2 right-5 font-display font-bold leading-none select-none pointer-events-none"
                style={{ fontSize: "7rem", color: "rgba(255,255,255,0.035)", letterSpacing: "-0.06em" }}
              >
                {card.num}
              </span>

              {/* Category label — same eyebrow pattern used across the site */}
              <p
                className="relative flex items-center gap-1.5 text-[10px] font-mono tracking-widest uppercase mb-5"
                style={{ color: card.accent }}
              >
                <span className="w-1 h-1 rounded-full shrink-0" style={{ background: card.accent }} />
                {card.tag}
              </p>

              {/* Title */}
              <h3
                className="relative font-display font-bold text-white mb-3 leading-snug"
                style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.3rem)", letterSpacing: "-0.02em" }}
              >
                {card.title}
              </h3>

              {/* Body */}
              <p className="relative text-white/45 text-sm leading-relaxed flex-1">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
