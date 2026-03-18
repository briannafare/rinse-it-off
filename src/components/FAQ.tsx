"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/lib/gsap";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  { q: "What's the difference between pressure washing and soft washing?", a: "Pressure washing uses high-pressure water for hard surfaces like concrete and stone. Soft washing uses lower pressure with specialized cleaning solutions — ideal for vinyl siding, stucco, wood, and painted finishes. We match the method to the surface." },
  { q: "Do you offer recurring maintenance programs?", a: "Monthly, quarterly, and seasonal plans for commercial properties. Recurring programs keep your building consistently clean, prevent surface damage, and cost less per visit than one-off cleanings." },
  { q: "What areas do you serve?", a: "Portland metro — Beaverton, Hillsboro, Lake Oswego, Tigard, Gresham, Milwaukie, and surrounding communities. For larger commercial projects, we cover the Willamette Valley." },
  { q: "Are you licensed and insured?", a: "Full liability insurance and workers' comp. Certificates of insurance available on request for property managers and building owners." },
  { q: "How do you handle hot water vs. cold water?", a: "Hot water is essential for oil, grease, and biological buildup — parking lots, trash pads, commercial kitchens. Cold water handles general surface cleaning. We bring both to every commercial job." },
  { q: "Will pressure washing damage my property?", a: "Not when done correctly. We match pressure and nozzle to each surface, protect landscaping and fixtures, and use soft washing on anything delicate." },
  { q: "How long does a typical job take?", a: "Single storefront: 1-2 hours. Full building with parking lot: half to full day. We provide a time estimate during your property assessment." },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const headRef = useScrollReveal();

  return (
    <section id="faq" className="py-24 md:py-32 bg-surface-alt">
      <div className="container-site">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2" ref={headRef}>
            <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-4 leading-tight">
              Questions? <span className="font-serif font-normal italic text-brand-blue">Answered.</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              Can&apos;t find what you need? We pick up the phone.
            </p>
            <a href="tel:+15037043755" className="text-sm font-semibold text-text-primary hover:text-brand-blue transition-colors">
              (503) 704-3755 →
            </a>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-border-light shadow-soft overflow-hidden">
              {FAQS.map((faq, i) => (
                <div key={i} className="border-b border-border-light last:border-b-0">
                  <button
                    onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                    className="flex items-center justify-between w-full py-5 px-6 text-left group"
                  >
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
