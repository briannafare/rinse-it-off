"use client";
import { useScrollReveal } from "@/lib/gsap";
import { ArrowRight, Phone, Mail } from "lucide-react";

export function CTA() {
  const ref = useScrollReveal();

  return (
    <section id="contact" className="py-24 md:py-32 bg-white">
      <div className="container-site" ref={ref}>
        <div className="relative rounded-[2rem] overflow-hidden bg-brand-dark p-10 md:p-16 lg:p-20">
          {/* Subtle grid bg */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-display font-extrabold text-white leading-tight mb-5"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", letterSpacing: "-0.02em" }}>
                Ready to make your property
                <br />
                <span className="font-serif font-normal italic text-brand-mint">look like new?</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed max-w-md">
                Schedule a free property assessment. We walk the site, give you an honest quote, and never pressure you into anything.
              </p>
            </div>

            <div className="space-y-3">
              <a href="mailto:hello@rinseitoff.com" className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
                <span className="w-10 h-10 rounded-lg bg-brand-mint/15 flex items-center justify-center text-brand-mint flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm text-white">Request an Assessment</p>
                  <p className="text-xs text-white/40 truncate">hello@rinseitoff.com</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-brand-mint group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </a>

              <a href="tel:+15037043755" className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
                <span className="w-10 h-10 rounded-lg bg-brand-blue/15 flex items-center justify-center text-brand-blue flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm text-white">Talk to a Real Person</p>
                  <p className="text-xs text-white/40">(503) 704-3755</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-brand-blue group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
              </a>

              <div className="flex items-center gap-2 pt-2 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-mint animate-pulse" />
                <span className="text-[11px] text-white/25 font-mono">Portland, OR — Licensed & Insured — Free estimates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
