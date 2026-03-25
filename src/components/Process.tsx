"use client";
import { useState, useEffect } from "react";
import { useScrollReveal } from "@/lib/gsap";
import { ArrowRight, ClipboardCheck, FileText, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Property Assessment",
    desc: "We review the site, identify problem areas, assess surface types, and determine the right cleaning approach.",
    icon: <ClipboardCheck className="w-6 h-6" />,
    bullets: ["Surface & material evaluation", "Problem area identification", "Method matching per surface"],
    color: "bg-brand-peach",
    shadowColor: "shadow-[0_8px_30px_rgba(255,219,176,0.35)]",
  },
  {
    num: "02",
    title: "Custom Scope & Quote",
    desc: "You get a written scope, schedule, and price with clear recommendations based on the property and service needs.",
    icon: <FileText className="w-6 h-6" />,
    bullets: ["Written scope of work", "Itemized schedule", "Transparent, no-surprise pricing"],
    color: "bg-brand-lavender",
    shadowColor: "shadow-[0_8px_30px_rgba(219,215,255,0.4)]",
  },
  {
    num: "03",
    title: "We Show Up & Deliver",
    desc: "We complete the work professionally and can recommend a recurring maintenance cadence if the property needs ongoing upkeep.",
    icon: <Sparkles className="w-6 h-6" />,
    bullets: ["On-time arrival", "Full cleanup", "Recurring options available"],
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
        <div ref={headRef} className="max-w-2xl mb-10">
          <h2
            className="font-display font-semibold text-text-primary leading-tight"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
          >
            Simple process. Clear scope.
            <br className="hidden md:block" />
            <span className="font-serif font-normal italic text-brand-blue">No one-size-fits-all washing.</span>
          </h2>
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
                    <h3 className="font-display font-semibold text-lg text-text-primary">{step.title}</h3>
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

                {/* Bottom — bullet list */}
                <ul className="mt-8 space-y-2">
                  {STEPS[active].bullets.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-brand-black/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-black/30 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

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
