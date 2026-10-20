"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useScrollReveal } from "@/lib/gsap";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/lib/faqs";

export function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const headRef = useScrollReveal();
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="py-24 md:py-32 bg-retro-pool">
      <div className="container-site">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2" ref={headRef}>
            <h2 className="text-text-primary mb-5">
              Questions? <span className="text-brand-black">Answered.</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              Everything you need to know about residential and commercial exterior cleaning.
            </p>
            <a
              href="tel:+19716264146"
              className="inline-flex min-h-11 items-center rounded-lg text-xl font-bold text-text-primary hover:text-text-secondary transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFFFF]"
            >
              (971) 626-4146 →
            </a>
          </div>

          <div className="lg:col-span-3">
            <div className="overflow-hidden border-t-[3px] border-[#0C1215]">
              {FAQS.map((faq, i) => {
                const isOpen = openIdx === i;
                return (
                  <div key={i} className="border-b-2 border-[#0C1215]/15">
                    <button
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      className="flex items-center justify-between w-full min-h-16 py-6 px-0 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1A6E93]"
                    >
                      <div className="flex items-center gap-4 pr-4">
                        <span className="text-lg font-bold md:text-xl text-text-primary group-hover:text-brand-black transition-colors motion-reduce:transition-none">{faq.q}</span>
                      </div>
                      <span className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300 motion-reduce:transition-none ${isOpen ? "bg-[#2E9BC6] text-[#0C1215]" : "border border-border text-text-muted"}`}>
                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-0 pb-6 pr-12 text-lg text-text-secondary leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
