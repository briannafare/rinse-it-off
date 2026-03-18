"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { ArrowRight } from "lucide-react";

const STEPS = [
  { num: "01", title: "Property Assessment", desc: "We walk your site, identify problem areas, match the right cleaning method to every surface. No guesswork." },
  { num: "02", title: "Custom Plan & Quote", desc: "Scope, schedule, pricing — in writing. We don't surprise you with extras or pad the invoice." },
  { num: "03", title: "We Show Up & Deliver", desc: "On time, every time. Your property looks like new, and we build a maintenance schedule to keep it there." },
];

export function Process() {
  const headRef = useScrollReveal();
  const stepsRef = useStaggerReveal(0.15);

  return (
    <section id="process" className="py-24 md:py-32 bg-white">
      <div className="container-site">
        <div ref={headRef} className="max-w-xl mb-14">
          <h2 className="font-display font-bold text-display-lg text-text-primary leading-tight mb-4">
            Three Steps. <span className="font-serif font-normal italic text-brand-blue">No</span> Run-Around.
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Straightforward process, honest pricing, real results.
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-3 gap-px bg-border-light rounded-3xl overflow-hidden border border-border-light">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-white p-7 md:p-9 group hover:bg-surface-alt transition-colors duration-500">
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-sm text-brand-blue font-bold">{step.num}</span>
                <div className="w-8 h-8 rounded-full border border-border-light flex items-center justify-center text-text-muted group-hover:border-brand-blue/30 group-hover:text-brand-blue transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
              <h3 className="font-display font-bold text-xl text-text-primary mb-3">{step.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
