"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/ui/Reveal";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "What's the difference between pressure washing and soft washing?",
    a: "Pressure washing uses high-pressure water to remove tough stains from hard surfaces like concrete and stone. Soft washing uses lower pressure combined with specialized cleaning solutions — ideal for delicate surfaces like vinyl siding, stucco, wood, and painted finishes. We use whichever method is safest and most effective for each surface.",
  },
  {
    q: "Do you offer recurring maintenance programs?",
    a: "Absolutely. We offer monthly, quarterly, and seasonal maintenance plans for commercial properties. A recurring program keeps your building consistently clean, prevents long-term surface damage, and costs less per visit than one-off cleanings. We'll build a custom schedule based on your property's needs.",
  },
  {
    q: "What areas of Portland do you serve?",
    a: "We serve the entire Portland metro area including Beaverton, Hillsboro, Lake Oswego, Tigard, Gresham, Milwaukie, and surrounding communities. For larger commercial projects, we serve clients throughout the Willamette Valley.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. We carry full liability insurance and workers' compensation coverage. We're happy to provide certificates of insurance to property managers and building owners upon request.",
  },
  {
    q: "How do you handle hot water vs. cold water cleaning?",
    a: "Hot water pressure washing is essential for removing oil, grease, and biological buildup — it's what we use on parking lots, trash pads, and commercial kitchen areas. Cold water is used for general surface cleaning where heat isn't necessary. We bring both to every commercial job so we can match the method to the mess.",
  },
  {
    q: "Will pressure washing damage my property?",
    a: "Not when it's done correctly. Our crew is trained to match pressure levels and nozzle types to each surface. We never use high pressure on surfaces that can't handle it — that's where soft washing comes in. We also protect landscaping, windows, and fixtures during every job.",
  },
  {
    q: "How long does a typical cleaning take?",
    a: "It depends on the scope. A single storefront might take 1-2 hours. A full building wash with parking lot cleaning can be a half-day to full-day project. We'll give you a clear time estimate during your property assessment so you can plan accordingly.",
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof FAQS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border-light last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-5 md:py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-display font-semibold text-base md:text-lg text-text-primary pr-8 group-hover:text-brand-blue-dark transition-colors duration-300">
          {faq.q}
        </span>
        <span className="flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted group-hover:border-brand-blue group-hover:text-brand-blue transition-all duration-300">
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
            <p className="pb-6 text-text-secondary leading-relaxed max-w-3xl">
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
          {/* Left heading */}
          <div className="lg:col-span-2">
            <Reveal>
              <span className="overline mb-3 block">FAQ</span>
              <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-4">
                Questions?
                <br />
                <span className="text-gradient-blue">We&apos;ve Got Answers.</span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                Can&apos;t find what you&apos;re looking for? Reach out — we&apos;re real people and we respond fast.
              </p>
            </Reveal>
          </div>

          {/* Right accordion */}
          <div className="lg:col-span-3">
            <Reveal>
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-border-light shadow-soft">
                {FAQS.map((faq, i) => (
                  <FAQItem
                    key={i}
                    faq={faq}
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
