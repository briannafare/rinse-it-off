"use client";
import { Reveal } from "@/components/ui/Reveal";
import { Phone, ArrowRight, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section id="contact" className="section-gap bg-white relative overflow-hidden">
      <div className="container-site">
        <Reveal>
          <div className="relative rounded-[32px] overflow-hidden">
            {/* Mint gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-mint/[0.08] via-brand-mint/[0.04] to-brand-blue/[0.06]" />
            <div className="absolute inset-0 border border-brand-mint/15 rounded-[32px]" />

            {/* Decorative dot */}
            <div className="absolute top-6 right-6 w-3 h-3 rounded-full bg-brand-mint" />
            <div className="absolute bottom-6 left-6 w-2 h-2 rounded-full bg-brand-blue/30" />

            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #0C1215 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

            <div className="relative p-8 md:p-16">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* Left: Copy */}
                <div>
                  <span className="pill-mint mb-5 inline-flex">Ready to get started?</span>
                  <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-5">
                    Let&apos;s Make Your
                    <br />
                    Property <span className="font-serif font-normal italic text-brand-blue">Shine.</span>
                  </h2>
                  <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                    Schedule a free property assessment. We&apos;ll walk the site, identify what needs attention, and give you an honest quote — no pressure.
                  </p>
                </div>

                {/* Right: Action cards */}
                <div className="space-y-4">
                  <a href="mailto:hello@rinseitoff.com" className="group flex items-center gap-5 p-5 rounded-2xl bg-white border border-border-light hover:border-brand-mint/30 hover:shadow-soft-md transition-all duration-300">
                    <span className="w-12 h-12 rounded-xl bg-brand-mint/10 flex items-center justify-center text-brand-mint flex-shrink-0 group-hover:bg-brand-mint group-hover:text-brand-black transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </span>
                    <div className="flex-1">
                      <p className="font-display font-bold text-sm text-text-primary">Request an Assessment</p>
                      <p className="text-xs text-text-muted">hello@rinseitoff.com</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-mint group-hover:translate-x-1 transition-all duration-300" />
                  </a>

                  <a href="tel:+15037043755" className="group flex items-center gap-5 p-5 rounded-2xl bg-white border border-border-light hover:border-brand-blue/30 hover:shadow-soft-md transition-all duration-300">
                    <span className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue flex-shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all duration-300">
                      <Phone className="w-5 h-5" />
                    </span>
                    <div className="flex-1">
                      <p className="font-display font-bold text-sm text-text-primary">Talk to a Real Person</p>
                      <p className="text-xs text-text-muted">(503) 704-3755</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-brand-blue group-hover:translate-x-1 transition-all duration-300" />
                  </a>

                  <div className="flex items-center gap-3 pt-2 px-2">
                    <span className="w-2 h-2 rounded-full bg-brand-mint" />
                    <p className="text-xs text-text-muted">Portland, OR — Licensed & Insured — Free estimates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
