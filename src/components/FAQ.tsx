"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/lib/gsap";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  { q: "What is the difference between pressure washing and soft washing?", a: "Pressure washing uses high-pressure water for hard surfaces like concrete, stone, and asphalt. Soft washing uses lower pressure combined with specialized biodegradable cleaning solutions — the right method for vinyl siding, stucco, wood, and painted surfaces. We assess every surface before we touch it and match the technique to the material." },
  { q: "How much does commercial pressure washing cost in Portland?", a: "Pricing depends on square footage, surface type, and how much buildup we're dealing with. We provide free on-site property assessments with transparent, written quotes — no hidden fees, no surprise line items. Recurring maintenance contracts reduce your per-visit cost significantly compared to one-off cleanings." },
  { q: "What areas in Portland do you serve?", a: "We cover the entire Portland metro: Beaverton, Hillsboro, Lake Oswego, Tigard, Tualatin, West Linn, Gresham, Milwaukie, and surrounding communities. For larger commercial projects — multi-building complexes, HOA communities, or industrial facilities — we serve clients throughout the Willamette Valley." },
  { q: "Do you offer recurring pressure washing maintenance programs?", a: "Yes — monthly, quarterly, and seasonal maintenance plans built around your property's specific needs. Recurring programs prevent the long-term damage that Portland's rain, moss, and algae cause to concrete, siding, and roofing. Set a schedule, and we handle the rest." },
  { q: "Is Rinse It Off licensed and insured?", a: "Full general liability insurance and workers' compensation coverage. We provide certificates of insurance to property managers and building owners on request — standard practice before we start any commercial project." },
  { q: "What is hot water pressure washing and when do you use it?", a: "Hot water dissolves oil, grease, and biological buildup that cold water can't touch. We use it on parking lots, trash pads, loading docks, drive-throughs, and commercial kitchen exhaust areas. We bring both hot and cold water systems to every commercial job so we can match the method to the mess." },
  { q: "Will pressure washing damage my building or property?", a: "Not when it's done by a trained crew with the right equipment. We match pressure levels and nozzle types to each surface, use soft washing on anything delicate, and protect landscaping, windows, and fixtures before we start. That's the difference between a professional operation and a guy with a rented machine." },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const headRef = useScrollReveal();

  return (
    <section id="faq" className="py-24 md:py-32 bg-surface-alt">
      <div className="container-site">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2" ref={headRef}>
            <h2 className="font-display font-semibold text-display-lg text-text-primary mb-3">
              Questions? <span className="text-brand-blue">Answered.</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              Everything you need to know about commercial and residential pressure washing in Portland.
            </p>
            <a href="tel:+15037043755" className="text-sm font-semibold text-text-primary hover:text-brand-blue transition-colors">
              (503) 704-3755 →
            </a>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-border-light shadow-[0_4px_24px_rgba(255,219,176,0.15)] overflow-hidden">
              {FAQS.map((faq, i) => (
                <div key={i} className="border-b border-border-light last:border-b-0">
                  <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="flex items-center justify-between w-full py-5 px-6 text-left group">
                    <div className="flex items-center gap-4 pr-4">
                      <span className="font-mono text-xs text-text-muted flex-shrink-0">0{i + 1}</span>
                      <span className="font-display font-semibold text-sm md:text-base text-text-primary group-hover:text-brand-blue transition-colors">{faq.q}</span>
                    </div>
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${openIdx === i ? "bg-brand-mint text-brand-black" : "border border-border text-text-muted"}`}>
                      {openIdx === i ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openIdx === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 pl-[3.25rem] text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
