"use client";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Request an Assessment",
    desc: "Tell us about your property. We'll walk the site, identify problem areas, and match the right cleaning approach.",
  },
  {
    num: "02",
    title: "Get Your Custom Plan",
    desc: "Scope, schedule, pricing — everything in writing. No surprises, no hidden fees, no guesswork.",
  },
  {
    num: "03",
    title: "We Handle It",
    desc: "Our crew shows up on time, every time. You get a clean property and a maintenance schedule that keeps it that way.",
  },
];

export function Process() {
  return (
    <section id="process" className="section-gap bg-surface-alt relative overflow-hidden">
      <div className="container-site">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="overline mb-3 block">How It Works</span>
          <h2 className="font-display font-extrabold text-display-lg text-text-primary">
            Three Steps. <span className="font-serif font-normal italic text-brand-blue">Zero</span> Hassle.
          </h2>
        </Reveal>

        {/* Horizontal visual element — "We → Clean → Everything" */}
        <Reveal className="mb-16 hidden md:block">
          <div className="flex items-center justify-center gap-5">
            <div className="w-28 h-28 rounded-full bg-white border border-border-light flex items-center justify-center">
              <span className="font-display font-extrabold text-lg text-text-primary">We</span>
            </div>
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 border border-brand-blue/15 overflow-hidden flex items-center justify-center">
              <span className="font-serif italic text-2xl text-brand-blue">Clean</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-mint flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-brand-black" />
            </div>
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-[#1a3040] to-[#2a4050] border border-white/5 overflow-hidden flex items-center justify-center relative">
              <span className="font-display font-bold text-lg text-white">Everything</span>
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
            </div>
          </div>
        </Reveal>

        {/* Step cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.1}>
              <div className="group rounded-3xl bg-white border border-border-light p-7 md:p-8 hover:border-brand-mint/30 hover:shadow-soft-md transition-all duration-500 h-full">
                {/* Step number */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-sm text-brand-mint font-bold">{step.num}</span>
                  <span className="w-8 h-8 rounded-full border border-border-light flex items-center justify-center text-text-muted group-hover:border-brand-mint group-hover:text-brand-mint transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
