"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "What's the difference between pressure washing and soft washing?",
    a: "Pressure washing uses high-pressure water for hard surfaces like concrete and stone. Soft washing uses lower pressure with specialized cleaning solutions — ideal for vinyl siding, stucco, wood, and painted finishes. We use whichever method is safest and most effective for each surface.",
  },
  {
    q: "Do you offer recurring maintenance programs?",
    a: "Yes — monthly, quarterly, and seasonal plans for commercial properties. Recurring programs keep your building consistently clean, prevent long-term surface damage, and cost less per visit than one-off cleanings. We build a custom schedule based on your property.",
  },
  {
    q: "What areas of Portland do you serve?",
    a: "The entire Portland metro including Beaverton, Hillsboro, Lake Oswego, Tigard, Gresham, Milwaukie, and surrounding communities. For larger commercial projects, we serve clients throughout the Willamette Valley.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Full liability insurance and workers' comp. We provide certificates of insurance to property managers and building owners on request.",
  },
  {
    q: "How do you handle hot water vs. cold water cleaning?",
    a: "Hot water is essential for oil, grease, and biological buildup — parking lots, trash pads, commercial kitchens. Cold water handles general surface cleaning. We bring both to every commercial job.",
  },
  {
    q: "Will pressure washing damage my property?",
    a: "Not when done correctly. Our crew matches pressure levels and nozzle types to each surface. We never use high pressure on delicate surfaces — that's where soft washing comes in. We also protect landscaping, windows, and fixtures during every job.",
  },
  {
    q: "How long does a typical cleaning take?",
    a: "A single storefront: 1-2 hours. Full building wash with parking lot: half-day to full day. We give you a clear time estimate during your property assessment.",
  },
];

function FAQItem({ faq, isOpen, onToggle, index }: { faq: typeof FAQS[0]; isOpen: boolean; onToggle: () => void; index: number }) {
  return (
    <div className="border-b border-border-light last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 md:py-6 text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4 pr-8">
          <span className="font-mono text-xs text-text-muted flex-shrink-0">0{index + 1}</span>
          <span className="font-display font-semibold text-base md:text-lg text-text-primary group-hover:text-brand-blue transition-colors duration-300">
            {faq.q}
          </span>
        </div>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-brand-mint text-brand-black" : "border border-border text-text-muted group-hover:border-brand-mint group-hover:text-brand-mint"}`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pl-10 text-text-secondary leading-relaxed max-w-3xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-gap bg-surface-alt relative">
      <div className="container-site">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2">
            <Reveal>
              <span className="overline mb-3 block">FAQ</span>
              <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-4">
                Questions?
                <br />
                <span className="font-serif font-normal italic text-brand-blue">Answered.</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed mb-6">
                Can&apos;t find what you need? We&apos;re real people and we respond fast.
              </p>
              <a href="tel:+15037043755" className="btn-ghost">
                Call (503) 704-3755 →
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-3">
            <Reveal>
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-border-light shadow-soft">
                {FAQS.map((faq, i) => (
                  <FAQItem
                    key={i}
                    faq={faq}
                    index={i}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
