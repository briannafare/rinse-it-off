"use client";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FAQItem } from "@/lib/faqs";

/** Mini FAQ accordion for the service pages. Same accordion pattern and look
 *  as the homepage FAQ, but the questions are passed in per service instead of
 *  reading the global list. One accent (water-blue), motion-reduce guarded. */
export function ServiceFAQ({ items }: { items: FAQItem[] }) {
  const [openIdx, setOpenIdx] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-3xl border border-border-light bg-white shadow-soft-md">
      {items.map((faq, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} className="border-b border-border-light last:border-b-0">
            <button
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`svc-faq-panel-${i}`}
              id={`svc-faq-trigger-${i}`}
              className="group flex min-h-11 w-full items-center justify-between px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#62C4EB]"
            >
              <div className="flex items-center gap-4 pr-4">
                <span className="flex-shrink-0 font-mono text-xs text-text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-sm font-semibold text-text-primary transition-colors group-hover:text-brand-black motion-reduce:transition-none md:text-base">
                  {faq.q}
                </span>
              </div>
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-300 motion-reduce:transition-none ${
                  isOpen ? "bg-[#62C4EB] text-white" : "border border-border text-text-muted"
                }`}
              >
                {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`svc-faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`svc-faq-trigger-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 pl-[3.25rem] text-sm leading-relaxed text-text-secondary">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
