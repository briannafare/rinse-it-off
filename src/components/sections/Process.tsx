"use client";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { ClipboardCheck, CalendarCheck, Sparkles } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Request an Assessment",
    desc: "Tell us about your property. We'll schedule a free walkthrough to identify problem areas, surface types, and the right cleaning approach.",
    icon: <ClipboardCheck className="w-6 h-6" />,
  },
  {
    num: "02",
    title: "Get Your Custom Plan",
    desc: "We'll build a cleaning plan specific to your property — scope, schedule, pricing. No surprises, no hidden fees, no guesswork.",
    icon: <CalendarCheck className="w-6 h-6" />,
  },
  {
    num: "03",
    title: "Sit Back. We Handle It.",
    desc: "Our crew shows up on time, every time. You get a property that looks like new and a maintenance schedule that keeps it that way.",
    icon: <Sparkles className="w-6 h-6" />,
  },
];

export function Process() {
  return (
    <section id="process" className="section-gap bg-white relative overflow-hidden">
      {/* Subtle bg decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-blue/[0.02] blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      <div className="container-site relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="overline mb-3 block">How It Works</span>
          <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-4">
            Three Steps to a Cleaner Property
          </h2>
          <p className="text-text-secondary text-lg">
            No hassle. No run-around. Just a straightforward process that gets results.
          </p>
        </Reveal>

        <StaggerContainer className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[72px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-brand-blue/20 via-brand-blue/40 to-brand-blue/20" />

          {STEPS.map((step) => (
            <StaggerItem key={step.num}>
              <div className="relative text-center group">
                {/* Step number circle */}
                <div className="relative mx-auto mb-6 w-[88px] h-[88px]">
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-brand-blue/20 group-hover:border-brand-blue/40 transition-colors duration-500" />
                  <div className="absolute inset-2 rounded-full bg-surface-blue group-hover:bg-brand-blue/10 transition-colors duration-500 flex items-center justify-center">
                    <span className="font-display font-extrabold text-2xl text-brand-blue">{step.num}</span>
                  </div>
                  {/* Floating icon */}
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center text-brand-blue border border-border-light">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
