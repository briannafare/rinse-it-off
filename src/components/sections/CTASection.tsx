"use client";
import { Reveal } from "@/components/ui/Reveal";
import { Phone, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section id="contact" className="section-gap bg-white relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-brand-blue/[0.05] blur-3xl" />
      </div>

      <div className="container-site relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-surface-blue via-white to-surface-card rounded-[32px] p-8 md:p-16 border border-brand-blue/10 shadow-glow-xl text-center">
          <Reveal>
            <span className="overline mb-4 block">Ready to Get Started?</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-5">
              Let&apos;s Make Your Property
              <br />
              <span className="text-gradient-blue">Look Like New</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Schedule a free property assessment. We&apos;ll walk your site, identify what needs attention, and give you an honest quote — no pressure, no obligation.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:hello@rinseitoff.com" className="btn-primary group text-base px-8 py-4">
                Request a Free Assessment
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a href="tel:+15037043755" className="btn-dark group text-base px-8 py-4">
                <Phone className="w-5 h-5" />
                Call (503) 704-3755
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="mt-6 text-sm text-text-muted">
              Portland, OR &bull; Licensed &amp; Insured &bull; Free estimates for commercial and residential
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
