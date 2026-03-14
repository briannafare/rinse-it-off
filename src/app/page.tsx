"use client";
import Link from "next/link";
import { ArrowRight, Phone, Check, X as XIcon, ChevronDown, Download, Shield, Leaf, Clock, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { site, services, steps, painPoints, solutions, faqs, residentialLinks } from "@/lib/data";
import { FadeIn, Stagger, StaggerChild, Parallax, SlideIn } from "@/lib/animations";
import { WaterHeroIllustration, FloatingDroplets, SatisfactionBadge, ServiceIcon } from "@/components/shared/WaterIllustrations";

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO — LIGHT, asymmetric, illustration-driven
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center bg-hero-gradient overflow-hidden">
      <FloatingDroplets />

      {/* Satisfaction badge — floats top-right on desktop */}
      <div className="absolute top-28 right-6 md:right-12 lg:right-20 z-10 hidden md:block">
        <Parallax speed={0.08}>
          <SatisfactionBadge />
        </Parallax>
      </div>

      <div className="container-site relative z-10 pt-24 md:pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* LEFT — Copy */}
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <span className="overline mb-5 block">Portland&apos;s Commercial Exterior Specialists</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display font-800 text-hero text-brand-black mb-6"
            >
              Exterior Cleaning<br />
              That Actually<br />
              <span className="text-gradient-blue">Shows Up.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-lg text-text-secondary max-w-md mb-8 leading-relaxed"
            >
              Rinse It Off is Portland&apos;s full-service commercial exterior cleaning company.
              Building facades, parking lots, storefronts, and recurring maintenance —
              one vendor, on your schedule, year-round.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-start gap-3"
            >
              <Link href="/contact" className="btn-primary group">
                Get a Free Property Assessment
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a href={site.phoneHref} className="btn-outline">
                <Phone className="w-4 h-4" /> {site.phone}
              </a>
            </motion.div>
          </div>

          {/* RIGHT — Water illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <WaterHeroIllustration className="w-full max-w-lg ml-auto" />
          </motion.div>
        </div>
      </div>

      {/* Wave transition */}
      <div className="wave-bottom-blue" />
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SERVICE CAROUSEL — auto-scrolling strip, from current site
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ServiceCarousel() {
  const serviceImages = [
    { label: "House Washing", color: "from-sky-100 to-sky-50" },
    { label: "Roof Cleaning", color: "from-blue-100 to-blue-50" },
    { label: "Concrete & Driveways", color: "from-cyan-100 to-cyan-50" },
    { label: "Deck & Fence", color: "from-teal-100 to-teal-50" },
    { label: "Window Washing", color: "from-sky-100 to-sky-50" },
    { label: "Commercial Exterior", color: "from-blue-100 to-blue-50" },
  ];

  return (
    <section className="py-8 bg-surface-alt overflow-hidden">
      <div className="flex animate-scroll-x" style={{ width: "max-content" }}>
        {[...serviceImages, ...serviceImages].map((svc, i) => (
          <div key={i} className="flex-shrink-0 w-64 mx-2.5">
            <div className={`relative h-40 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center overflow-hidden group cursor-pointer`}>
              {/* Decorative water droplet overlay */}
              <svg className="absolute top-3 right-3 w-8 h-8 opacity-10" viewBox="0 0 24 32" fill="none">
                <path d="M12 0C12 0 24 14 24 20C24 26.6 18.6 32 12 32C5.4 32 0 26.6 0 20C0 14 12 0 12 0Z" fill="#62C4EB" />
              </svg>
              <div className="text-center px-4">
                <p className="font-display font-700 text-sm text-brand-dark/80">{svc.label}</p>
                <p className="text-[11px] text-text-muted mt-1">[Photo placeholder]</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TRUST STRIP
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TrustStrip() {
  const items = [
    { icon: Shield, text: "Licensed & Insured" },
    { icon: Leaf, text: "100% Eco-Friendly" },
    { icon: Clock, text: "Flexible Scheduling" },
    { icon: Zap, text: "Satisfaction Guaranteed" },
  ];
  return (
    <section className="py-6 bg-white border-b border-border-light">
      <div className="container-site">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
          {items.map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-sm text-text-secondary">
              <item.icon className="w-4 h-4 text-brand-blue" strokeWidth={2} />
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COMMERCIAL SERVICES — Bento grid with custom icons and depth
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CommercialServices() {
  return (
    <section className="section-gap bg-white relative">
      {/* Decorative background */}
      <div className="absolute top-20 left-[5%] w-48 h-48 bg-brand-blue/[0.03] rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

      <div className="container-site relative z-10">
        <FadeIn className="max-w-2xl mb-14">
          <span className="overline mb-4 block">Commercial Services</span>
          <h2 className="font-display font-800 text-display-lg text-brand-black mb-4">
            One vendor. Every surface.{" "}
            <span className="text-gradient-blue">Year-round.</span>
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            Stop juggling multiple contractors. Rinse It Off handles your entire
            exterior — from the parking lot to the roofline — with one point of
            contact and one maintenance plan.
          </p>
        </FadeIn>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.06}>
          {services.map((svc) => (
            <StaggerChild key={svc.title} className={svc.featured ? "md:col-span-2" : ""}>
              <div className={`group relative h-full rounded-3xl transition-all duration-400 overflow-hidden ${
                svc.featured
                  ? "bg-brand-black text-white p-8 md:p-10 hover:shadow-[0_20px_60px_rgba(12,18,21,0.25)]"
                  : "bg-surface-card border border-border-light p-7 hover-lift"
              }`}>
                {/* Featured card decorative element */}
                {svc.featured && (
                  <div className="absolute top-0 right-0 w-40 h-40 bg-brand-blue/[0.06] rounded-full blur-[50px] pointer-events-none" />
                )}

                <div className={`relative z-10 ${svc.featured ? "flex flex-col md:flex-row md:items-start gap-6" : ""}`}>
                  <div className={`mb-4 ${svc.featured ? "md:mb-0 flex-shrink-0" : ""}`}>
                    <ServiceIcon type={svc.icon} className={`w-11 h-11 ${svc.featured ? "[&_*]:!stroke-brand-blue [&_*]:!fill-brand-blue/15" : ""}`} />
                  </div>
                  <div>
                    <h3 className={`font-display font-700 text-lg mb-2 ${svc.featured ? "text-white" : "text-brand-black"}`}>
                      {svc.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${svc.featured ? "text-white/50" : "text-text-secondary"}`}>
                      {svc.desc}
                    </p>
                    {svc.featured && (
                      <span className="inline-flex items-center gap-1.5 mt-5 text-brand-blue text-sm font-semibold group-hover:gap-2.5 transition-all">
                        Our most popular program <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </StaggerChild>
          ))}
        </Stagger>

        <FadeIn delay={0.2} className="mt-10">
          <Link href="/contact" className="btn-primary group">
            Request a Free Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PROBLEM / SOLUTION — with the brand's playful voice
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProblemSolution() {
  return (
    <section className="section-gap bg-surface-alt relative overflow-hidden wave-bottom-white">
      <div className="absolute -top-16 -right-16 w-64 h-80 bg-brand-blue/[0.03] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-12 pointer-events-none" aria-hidden="true" />

      <div className="container-site relative z-10">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display font-800 text-display-lg text-brand-black mb-3">
            Tired of vendors who <span className="text-gradient-blue">don&apos;t show up?</span>
          </h2>
          <p className="text-text-secondary text-lg">
            You&apos;re not alone. If you manage commercial property in Portland, you already know the frustration.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <SlideIn from="left">
            <div className="bg-white p-7 md:p-8 rounded-3xl border border-red-100/80 shadow-[0_4px_24px_rgba(239,68,68,0.03)] h-full">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                  <XIcon className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="font-display font-700 text-sm text-red-400 uppercase tracking-wide">Don&apos;t Get Burned Again</h3>
              </div>
              <ul className="space-y-4">
                {painPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-text-secondary leading-snug">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </SlideIn>

          <SlideIn from="right" delay={0.1}>
            <div className="bg-white p-7 md:p-8 rounded-3xl border border-emerald-100/80 shadow-[0_4px_24px_rgba(16,185,129,0.03)] h-full">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="font-display font-700 text-sm text-emerald-500 uppercase tracking-wide">At Rinse It Off, We&apos;re Different</h3>
              </div>
              <ul className="space-y-4">
                {solutions.map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm text-text-secondary leading-snug">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </SlideIn>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PROCESS STEPS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProcessSteps() {
  return (
    <section className="section-gap bg-white relative">
      <div className="container-site">
        <FadeIn className="text-center mb-16">
          <span className="overline mb-4 block">How It Works</span>
          <h2 className="font-display font-800 text-display-lg text-brand-black">
            Three steps to a sparkling clean property
          </h2>
        </FadeIn>

        <Stagger className="grid md:grid-cols-3 gap-10 lg:gap-16" stagger={0.12}>
          {steps.map((step, i) => (
            <StaggerChild key={step.num}>
              <div className="relative text-center">
                {/* Large watermark number */}
                <span className="font-mono font-bold text-[80px] leading-none text-brand-blue/[0.06] block">
                  {step.num}
                </span>
                <div className="relative -mt-10 z-10">
                  <h3 className="font-display font-700 text-xl text-brand-black mb-3">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">{step.body}</p>
                </div>

                {/* Connector */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-5 lg:-right-10">
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" className="text-brand-blue/15">
                      <path d="M0 10H32M32 10L24 4M32 10L24 16" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}
              </div>
            </StaggerChild>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RESIDENTIAL BRIDGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ResidentialBridge() {
  return (
    <section className="py-16 md:py-20 bg-surface-alt">
      <div className="container-site">
        <FadeIn>
          <div className="bg-white rounded-3xl border border-border shadow-card p-8 md:p-12 flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              <span className="overline mb-3 block">Residential Services</span>
              <h2 className="font-display font-800 text-display-sm text-brand-black mb-3">
                Portland homeowners — we&apos;ve got you too.
              </h2>
              <p className="text-text-secondary leading-relaxed">
                The same professional-grade cleaning we bring to commercial properties, available for your home.
                Gentle, eco-friendly, and built for the PNW climate.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 lg:w-56 flex-shrink-0">
              {residentialLinks.map((l) => (
                <Link key={l.href} href={l.href}
                  className="group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-text-primary hover:bg-brand-blue/[0.04] hover:text-brand-blue transition-all">
                  {l.label}
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-blue transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LEAD MAGNET — DARK section (accent)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LeadMagnet() {
  return (
    <section className="relative py-24 md:py-32 bg-dark-section overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-blue/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="container-site relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <FadeIn>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-brand-blue text-xs font-semibold tracking-wide uppercase mb-7">
              <Download className="w-3.5 h-3.5" /> Free Resource
            </span>
            <h2 className="font-display font-800 text-display text-white mb-4">
              Download Our Commercial Property Maintenance Checklist
            </h2>
            <p className="text-white/40 mb-10 leading-relaxed">
              A seasonal guide for Portland property managers. Know exactly what exterior maintenance
              your property needs — and when.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="glass-dark rounded-2xl p-6 md:p-8 max-w-md mx-auto">
              <form className="flex flex-col gap-3">
                <input type="text" name="first_name" placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all" />
                <input type="email" name="email" placeholder="Email address"
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/25 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all" />
                <input type="hidden" name="source" value="website-lead-magnet" />
                <button type="submit" className="w-full py-3.5 gradient-cta text-brand-black font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
                  Get the Free Checklist
                </button>
              </form>
              <p className="text-[11px] text-white/20 mt-3">No spam. Just one helpful PDF.</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FAQ
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="section-gap bg-white">
      <div className="container-site max-w-3xl">
        <FadeIn className="text-center mb-12">
          <h2 className="font-display font-800 text-display text-brand-black">Frequently Asked Questions</h2>
        </FadeIn>
        <div className="space-y-2.5">
          {faqs.map((faq, i) => (
            <FadeIn key={i} delay={i * 0.03}>
              <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                open === i ? "border-brand-blue/25 shadow-[0_0_0_1px_rgba(98,196,235,0.06)]" : "border-border hover:border-brand-blue/15"
              }`}>
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left">
                  <span className="font-display font-600 text-[15px] text-brand-black pr-6">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-blue flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FINAL CTA — gradient
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FinalCTA() {
  return (
    <section className="relative py-20 md:py-24 gradient-cta overflow-hidden">
      <div className="absolute top-1/2 left-[8%] -translate-y-1/2 w-32 h-32 rounded-full border border-white/[0.15] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-[30%] right-[10%] w-20 h-20 rounded-full border border-white/[0.12] pointer-events-none" aria-hidden="true" />

      <div className="container-site relative z-10 text-center">
        <FadeIn>
          <h2 className="font-display font-800 text-display text-brand-black mb-4 max-w-2xl mx-auto">
            Ready to stop managing your property&apos;s exterior yourself?
          </h2>
          <p className="text-brand-dark/50 mb-8 max-w-lg mx-auto">
            Request a free property assessment. We&apos;ll walk your property, scope every surface,
            and build a plan that fits your budget.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-dark group">
              Schedule Your Free Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-brand-dark/15 text-brand-dark text-sm font-semibold rounded-full hover:bg-brand-dark/[0.04] transition-all">
              <Phone className="w-4 h-4" /> {site.phone}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ━━━ PAGE ━━━ */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ServiceCarousel />
      <TrustStrip />
      <CommercialServices />
      <ProblemSolution />
      <ProcessSteps />
      <ResidentialBridge />
      <LeadMagnet />
      <FAQ />
      <FinalCTA />
    </>
  );
}
