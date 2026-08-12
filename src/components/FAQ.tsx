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
    <section id="faq" className="py-24 md:py-32 bg-surface-alt">
      <div className="container-site">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-2" ref={headRef}>
            <h2 className="font-display font-semibold text-display-lg text-text-primary mb-3">
              Questions? <span className="text-brand-black">Answered.</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-4">
              Everything you need to know about residential and commercial exterior cleaning in Portland.
            </p>
            <a
              href="tel:+15037043755"
              className="inline-flex min-h-11 items-center rounded-lg text-sm font-semibold text-text-primary hover:text-text-secondary transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F7F4]"
            >
              (503) 704-3755 →
            </a>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-border-light shadow-soft-md overflow-hidden">
              {FAQS.map((faq, i) => {
                const isOpen = openIdx === i;
                return (
                  <div key={i} className="border-b border-border-light last:border-b-0">
                    <button
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      className="flex items-center justify-between w-full min-h-11 py-5 px-6 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#62C4EB]"
                    >
                      <div className="flex items-center gap-4 pr-4">
                        <span className="font-mono text-xs text-text-muted flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-display font-semibold text-sm md:text-base text-text-primary group-hover:text-brand-black transition-colors motion-reduce:transition-none">{faq.q}</span>
                      </div>
                      <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-300 motion-reduce:transition-none ${isOpen ? "bg-[#62C4EB] text-white" : "border border-border text-text-muted"}`}>
                        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
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
                          <p className="px-6 pb-5 pl-[3.25rem] text-sm text-text-secondary leading-relaxed">{faq.a}</p>
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
