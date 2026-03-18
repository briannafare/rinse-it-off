"use client";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/gsap";
import { ArrowRight, ClipboardCheck, FileText, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Property Assessment",
    desc: "We walk your site, identify problem areas, assess surface types, and determine the right cleaning methods. No generic quotes — every property is different.",
    icon: <ClipboardCheck className="w-6 h-6" />,
    detail: "Surface analysis • Problem mapping • Method matching",
    color: "bg-brand-peach",
    shadowColor: "shadow-[0_8px_30px_rgba(255,219,176,0.35)]",
  },
  {
    num: "02",
    title: "Custom Plan & Quote",
    desc: "You get a written scope, schedule, and price. We break down exactly what we're doing, when, and what it costs. No surprises, no padding, no fine print.",
    icon: <FileText className="w-6 h-6" />,
    detail: "Scope documentation • Schedule • Transparent pricing",
    color: "bg-brand-lavender",
    shadowColor: "shadow-[0_8px_30px_rgba(219,215,255,0.4)]",
  },
  {
    num: "03",
    title: "We Show Up & Deliver",
    desc: "On time, every time. Your property looks like new when we leave, and we set up a maintenance schedule so it stays that way through Portland's 164 days of rain.",
    icon: <Sparkles className="w-6 h-6" />,
    detail: "On-time arrival • Full cleanup • Maintenance plan",
    color: "bg-brand-lime",
    shadowColor: "shadow-[0_8px_30px_rgba(218,255,153,0.35)]",
  },
];

export function Process() {
  const headRef = useScrollReveal();
  const [active, setActive] = useState(0);
  const [autoPaused, setAutoPaused] = useState(false);

  // Auto-advance every 5s unless user has clicked
  useEffect(() => {
    if (autoPaused) return;
    const timer = setInterval(() => setActive((a) => (a + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, [autoPaused]);

  const handleClick = (i: number) => {
    setActive(i);
    setAutoPaused(true);
  };

  return (
    <section id="process" className="py-24 md:py-32 bg-white">
      <div className="container-site">
        <div ref={headRef} className="max-w-xl mb-10">
          <h2 className="font-display font-semibold text-display-lg text-text-primary mb-3">
            Three Steps.{" "}
            <span className="font-serif font-normal italic text-brand-blue">No</span>{" "}
            Run-Around.
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Straightforward process, honest pricing, real results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left — step selector */}
          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <button
                key={step.num}
                onClick={() => handleClick(i)}
                className={`w-full text-left rounded-2xl border transition-all duration-500 p-5 md:p-6 group ${
                  active === i
                    ? `border-transparent ${step.shadowColor} bg-white`
                    : "border-border-light bg-surface-alt hover:bg-white hover:border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step number with pastel bg */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                    active === i ? step.color : "bg-surface-alt"
                  }`}>
                    <span className={`font-mono text-xs font-bold ${active === i ? "text-brand-black" : "text-text-muted"}`}>{step.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-lg text-text-primary mb-1">{step.title}</h3>
                    <p className={`text-sm leading-relaxed transition-all duration-500 overflow-hidden ${
                      active === i ? "text-text-secondary max-h-40 opacity-100" : "text-text-muted max-h-0 opacity-0"
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                  {/* Arrow */}
                  <ArrowRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-all duration-300 ${
                    active === i ? "text-brand-blue translate-x-0.5" : "text-text-muted/30"
                  }`} />
                </div>
              </button>
            ))}
          </div>

          {/* Right — animated visual for active step */}
          <div className="relative min-h-[320px] md:min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`rounded-3xl p-8 md:p-10 h-full flex flex-col justify-between ${STEPS[active].color}`}
              >
                {/* Top — large icon + step */}
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-brand-black/10 flex items-center justify-center text-brand-black">
                      {STEPS[active].icon}
                    </div>
                    <span className="font-mono text-sm text-brand-black/40">{STEPS[active].num} / 03</span>
                  </div>
                  <h3 className="font-display font-semibold text-2xl md:text-3xl text-brand-black mb-3">
                    {STEPS[active].title}
                  </h3>
                  <p className="text-brand-black/60 leading-relaxed">
                    {STEPS[active].desc}
                  </p>
                </div>

                {/* Bottom — detail tags */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {STEPS[active].detail.split(" • ").map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-brand-black/[0.06] text-brand-black/70 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Progress bar */}
                <div className="mt-6 h-1 bg-brand-black/[0.08] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-brand-black/20 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: autoPaused ? 999 : 5, ease: "linear" }}
                    key={`${active}-${autoPaused}`}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
