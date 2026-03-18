"use client";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* Placeholder photo card — represents where real photography goes */
function PhotoCard({ label, className = "", aspect = "aspect-[4/3]" }: { label: string; className?: string; aspect?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue/8 via-surface-alt to-brand-blue/5 border border-border-light ${aspect} ${className}`}>
      <div className="absolute inset-0 flex items-end p-4">
        <span className="pill-outline text-[10px] backdrop-blur-sm bg-white/70">{label}</span>
      </div>
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #62C4EB 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center pt-24 pb-8 md:pt-28 md:pb-16 bg-white overflow-hidden">
      <div className="container-site relative z-10 w-full">
        <motion.div initial="hidden" animate="visible" variants={stagger}>

          {/* ── TOP ROW: Headline + Bento Cards ── */}
          <div className="grid lg:grid-cols-12 gap-4 md:gap-5">

            {/* ── LEFT: Headline card with mint accent ── */}
            <motion.div variants={fadeUp} className="lg:col-span-5 relative">
              <div className="rounded-3xl bg-brand-mint/[0.08] border border-brand-mint/20 p-8 md:p-10 h-full flex flex-col justify-between min-h-[340px] md:min-h-[420px]">
                {/* Overline pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="pill-mint">Commercial</span>
                  <span className="pill-blue">Residential</span>
                  <span className="pill-outline">Portland, OR</span>
                </div>

                {/* Headline — serif + sans mix */}
                <div className="flex-1 flex flex-col justify-center">
                  <h1 className="text-hero font-display font-extrabold text-text-primary leading-[0.95]">
                    We Make
                    <br />
                    <span className="font-serif font-normal italic text-brand-blue">Dirty</span> Buildings
                    <br />
                    <span className="relative inline-block">
                      Clean.
                      {/* Neon underline accent */}
                      <span className="absolute -bottom-1 left-0 w-full h-2 bg-brand-mint/30 rounded-full -z-10" />
                    </span>
                  </h1>
                </div>

                {/* Bottom row */}
                <div className="flex items-center gap-4 mt-6">
                  <a href="#contact" className="btn-mint group">
                    Free Assessment
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <a href="tel:+15037043755" className="btn-ghost group">
                    <Phone className="w-4 h-4" />
                    (503) 704-3755
                  </a>
                </div>

                {/* Decorative corner dot */}
                <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-brand-mint" />
              </div>
            </motion.div>

            {/* ── RIGHT: Photo bento grid ── */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-5">
              {/* Tall photo card */}
              <motion.div variants={fadeUp} className="row-span-2">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a2e3d] via-[#2a4050] to-[#1a3040] h-full min-h-[260px] md:min-h-full border border-white/5">
                  {/* Dark photo placeholder - commercial building context */}
                  <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
                    <div className="flex justify-between items-start">
                      <span className="pill bg-white/10 border-white/10 text-white/80 text-[10px] backdrop-blur-sm">Before → After</span>
                      <span className="w-8 h-8 rounded-full bg-brand-mint/20 backdrop-blur-sm flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-brand-mint" />
                      </span>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs font-display mb-1">Featured Project</p>
                      <p className="text-white font-display font-bold text-lg">Commercial Building Wash</p>
                      <p className="text-white/50 text-sm mt-1">Portland, OR — 4-story office complex</p>
                    </div>
                  </div>
                  {/* Subtle grid texture */}
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                </div>
              </motion.div>

              {/* Top right — stat card */}
              <motion.div variants={fadeUp}>
                <div className="rounded-3xl bg-surface-alt border border-border-light p-5 md:p-6 h-full min-h-[140px] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted font-display uppercase tracking-wider">Satisfaction</span>
                    <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
                  </div>
                  <div>
                    <span className="text-4xl md:text-5xl font-display font-extrabold text-text-primary">100</span>
                    <span className="text-2xl font-display font-bold text-brand-mint">%</span>
                  </div>
                  <p className="text-xs text-text-muted">Client satisfaction guarantee on every project</p>
                </div>
              </motion.div>

              {/* Bottom right — photo card */}
              <motion.div variants={fadeUp}>
                <PhotoCard label="Parking lot restoration" aspect="aspect-auto h-full min-h-[140px]" />
              </motion.div>
            </div>
          </div>

          {/* ── BOTTOM ROW: Trust signals ── */}
          <motion.div variants={fadeUp} className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {[
              { label: "Licensed & Insured", detail: "Full liability coverage" },
              { label: "Hot & Cold Water", detail: "Every surface type covered" },
              { label: "Recurring Programs", detail: "Monthly, quarterly, seasonal" },
              { label: "Soft & Pressure Wash", detail: "Right method, every time" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl bg-surface-alt border border-border-light px-4 py-3 flex items-center gap-3 group hover:border-brand-mint/30 transition-colors duration-300">
                <span className="w-2 h-2 rounded-full bg-brand-mint flex-shrink-0" />
                <div>
                  <p className="text-xs font-display font-semibold text-text-primary">{item.label}</p>
                  <p className="text-[10px] text-text-muted">{item.detail}</p>
                </div>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
