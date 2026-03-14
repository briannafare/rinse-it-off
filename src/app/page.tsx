"use client";
import Link from "next/link";
import Image from "next/image";
import {
  Building2, Car, Store, Home, Sparkles, CalendarCheck,
  ArrowRight, Phone, Check, X as XIcon, Droplets, Shield,
  Leaf, ChevronDown, Mail, Download, Star, Clock, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  siteConfig, commercialServices, processSteps,
  painPoints, homeFaqs, residentialLinks,
} from "@/lib/data";
import { FadeUp, StaggerContainer, StaggerItem } from "@/lib/animations";

const iconMap: Record<string, React.ElementType> = { Building2, Car, Store, Home, Sparkles, CalendarCheck };

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO — Dark, atmospheric, gradient mesh
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden gradient-mesh-dark grain">
      {/* Floating orbs for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[15%] left-[10%] w-[450px] h-[450px] rounded-full bg-brand-blue/[0.08] blur-[100px] orb-drift" />
        <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] rounded-full bg-brand-mint/[0.05] blur-[90px] orb-drift-alt" />
        <div className="absolute top-[60%] left-[50%] w-[250px] h-[250px] rounded-full bg-brand-violet/[0.04] blur-[80px] orb-drift" />
      </div>

      {/* Satisfaction badge — spinning, top right area */}
      <div className="absolute top-32 right-8 md:right-16 lg:right-24 hidden md:block pointer-events-none z-10">
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 120 120" className="w-full h-full spin-slow">
            <defs>
              <path id="circlePath" d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
            </defs>
            <text fill="rgba(255,255,255,0.35)" fontSize="10" fontWeight="600" letterSpacing="3" fontFamily="var(--font-jakarta)">
              <textPath href="#circlePath">
                ✦ YOUR SATISFACTION ✦ GUARANTEED ✦
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <Droplets className="w-6 h-6 text-brand-blue/60" />
          </div>
        </div>
      </div>

      <div className="container-main relative z-10 pt-28 pb-12">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase glass-dark text-brand-blue mb-7">
              <Droplets className="w-3.5 h-3.5" />
              Portland&apos;s Commercial Exterior Specialists
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-display font-800 text-hero text-white tracking-display leading-[0.95] mb-6 text-balance"
          >
            Every Surface.<br />
            Every Season.<br />
            <span className="text-gradient">Handled.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-white/55 max-w-xl mb-10 leading-relaxed"
          >
            Rinse It Off is Portland&apos;s full-service commercial exterior cleaning company.
            Building facades, parking lots, storefronts, and recurring maintenance programs
            — handled by one team, on your schedule.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/contact"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-blue text-white font-semibold rounded-full shadow-[0_0_24px_rgba(98,196,235,0.3)] hover:shadow-[0_0_40px_rgba(98,196,235,0.5)] hover:bg-brand-blue-dark transition-all duration-300 text-sm">
              Get a Free Property Assessment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/25 hover:bg-white/[0.03] font-medium transition-all duration-300 text-sm">
              <Phone className="w-4 h-4" />
              {siteConfig.phone}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Wave transition to white */}
      <div className="wave-top-white" />
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TRUST STRIP — Light, icons in blue
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function TrustStrip() {
  const items = [
    { icon: Building2, text: "Commercial & Residential" },
    { icon: Leaf, text: "100% Eco-Friendly Products" },
    { icon: Shield, text: "Licensed & Insured" },
    { icon: Clock, text: "Flexible Scheduling" },
  ];
  return (
    <section className="py-8 border-b border-slate-100">
      <div className="container-main">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {items.map((item) => (
            <div key={item.text} className="flex items-center gap-2.5 text-sm text-text-secondary">
              <item.icon className="w-4.5 h-4.5 text-brand-blue flex-shrink-0" strokeWidth={1.8} />
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   COMMERCIAL SERVICES — Bento grid with depth
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function CommercialServices() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <FadeUp className="text-center mb-16">
          <span className="overline mb-4 block">Commercial Services</span>
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary mb-5 text-balance">
            One Vendor. Every Surface. <span className="text-brand-blue">Year-Round.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
            Stop juggling multiple contractors. Rinse It Off handles your entire
            exterior — from the parking lot to the roofline — with one point of
            contact and one maintenance plan.
          </p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6" stagger={0.07}>
          {commercialServices.map((service) => {
            const Icon = iconMap[service.icon];
            const isFeatured = service.featured;
            return (
              <StaggerItem key={service.title} className={isFeatured ? "md:col-span-2 lg:col-span-2" : ""}>
                <div className={`group relative h-full rounded-2xl border transition-all duration-400 cursor-pointer overflow-hidden ${
                  isFeatured
                    ? "bg-gradient-to-br from-brand-dark to-[#0E1629] border-brand-blue/20 text-white p-8 md:p-10"
                    : "bg-white border-slate-150 hover:border-brand-blue/25 hover:shadow-[0_8px_40px_rgba(98,196,235,0.08)] p-7"
                }`}
                style={{ borderColor: isFeatured ? undefined : 'rgb(226 232 240)' }}
                >
                  {/* Decorative orb on featured card */}
                  {isFeatured && (
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-blue/[0.08] rounded-full blur-[60px] pointer-events-none" />
                  )}

                  <div className={`relative z-10 flex ${isFeatured ? "flex-col md:flex-row md:items-start gap-6" : "flex-col"}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isFeatured ? "bg-brand-blue/15" : "bg-brand-blue/[0.07]"
                    }`}>
                      <Icon className="w-5.5 h-5.5 text-brand-blue" />
                    </div>
                    <div>
                      <h3 className={`font-display font-700 text-lg mb-2 ${isFeatured ? "text-white" : "text-text-primary"}`}>
                        {service.title}
                      </h3>
                      <p className={`text-sm leading-relaxed ${isFeatured ? "text-white/55" : "text-text-secondary"}`}>
                        {service.description}
                      </p>
                      {isFeatured && (
                        <span className="inline-flex items-center gap-1.5 mt-5 text-brand-blue text-sm font-semibold group-hover:gap-2.5 transition-all">
                          Our most popular program <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeUp delay={0.3} className="text-center mt-12">
          <Link href="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-full shadow-[0_0_20px_rgba(98,196,235,0.2)] hover:shadow-[0_0_32px_rgba(98,196,235,0.35)] transition-all text-sm">
            Request a Free Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAIN POINTS — from current site's agitation pattern
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProblemSolution() {
  return (
    <section className="section-padding bg-blue-tint relative overflow-hidden">
      {/* Decorative droplet shape */}
      <div className="absolute -top-20 -right-20 w-64 h-80 bg-brand-blue/[0.03] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] rotate-12 pointer-events-none" />

      <div className="container-main relative z-10">
        <FadeUp className="text-center mb-14">
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary mb-4 text-balance">
            Tired of Vendors Who <span className="text-brand-blue">Don&apos;t Show Up?</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            If you manage commercial property in Portland, you already know the frustration.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FadeUp delay={0.1}>
            <div className="bg-white p-7 rounded-2xl border border-red-100/60 shadow-[0_4px_24px_rgba(239,68,68,0.04)] h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                  <XIcon className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="font-display font-700 text-sm text-red-400 uppercase tracking-wide">The Problem</h3>
              </div>
              <ul className="space-y-3.5">
                {painPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-text-secondary leading-snug">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-300 mt-1.5 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="bg-white p-7 rounded-2xl border border-emerald-100/60 shadow-[0_4px_24px_rgba(16,185,129,0.04)] h-full">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Check className="w-4 h-4 text-emerald-500" />
                </div>
                <h3 className="font-display font-700 text-sm text-emerald-500 uppercase tracking-wide">How We&apos;re Different</h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  "One vendor for your entire exterior — no more juggling",
                  "Custom maintenance plans that run on schedule",
                  "Clear communication and real accountability",
                  "Eco-friendly methods built for Portland\u2019s climate",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm text-text-secondary leading-snug">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PROCESS STEPS — with personality from current site
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ProcessSection() {
  return (
    <section className="section-padding bg-white relative">
      <div className="container-main">
        <FadeUp className="text-center mb-16">
          <span className="overline mb-4 block">How It Works</span>
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary mb-3">
            Three Steps to a Maintained Property
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            No complicated processes, no runaround. Here&apos;s exactly what happens when you reach out.
          </p>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-0" stagger={0.12}>
          {processSteps.map((step, i) => (
            <StaggerItem key={step.number}>
              <div className="relative text-center md:text-left lg:px-10">
                {/* Step number — large, watermark-style */}
                <span className="font-mono font-bold text-[72px] leading-none text-brand-blue/[0.08] block mb-1">
                  {step.number}
                </span>
                <h3 className="font-display font-700 text-xl text-text-primary mb-3 -mt-6 relative z-10">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>

                {/* Connector arrow between steps */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-10 -right-1 items-center">
                    <div className="w-6 border-t border-dashed border-brand-blue/20" />
                    <ArrowRight className="w-3.5 h-3.5 text-brand-blue/25 -ml-0.5" />
                  </div>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.3} className="text-center mt-14">
          <Link href="/contact"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-full shadow-[0_0_20px_rgba(98,196,235,0.2)] hover:shadow-[0_0_32px_rgba(98,196,235,0.35)] transition-all text-sm">
            Start with a Free Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RESIDENTIAL BRIDGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function ResidentialBridge() {
  return (
    <section className="py-16 md:py-20 bg-blue-tint relative overflow-hidden">
      <div className="container-main relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-soft-lg p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              <FadeUp>
                <span className="overline mb-3 block">Residential Services</span>
                <h2 className="font-display font-800 text-2xl md:text-3xl tracking-heading leading-heading text-text-primary mb-3">
                  Portland Homeowners — We&apos;ve Got You Too.
                </h2>
                <p className="text-text-secondary leading-relaxed">
                  The same professional-grade cleaning we bring to commercial properties,
                  now for your home. Gentle, eco-friendly, and built for the PNW climate.
                </p>
              </FadeUp>
            </div>
            <div className="flex flex-col gap-2 lg:w-60 flex-shrink-0">
              {residentialLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-text-primary hover:bg-brand-blue/[0.05] hover:text-brand-blue transition-all">
                  {link.label}
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-blue transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LEAD MAGNET — Dark section for contrast
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function LeadMagnet() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden gradient-mesh-dark grain">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="container-main relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <FadeUp>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase glass-dark text-brand-blue mb-7">
              <Download className="w-3.5 h-3.5" />
              Free Resource
            </span>
            <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-white mb-4 text-balance">
              Download Our Commercial Property Maintenance Checklist
            </h2>
            <p className="text-white/45 mb-10 leading-relaxed max-w-lg mx-auto">
              A seasonal guide for Portland property managers. Know exactly what
              exterior maintenance your property needs — and when.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="glass-dark rounded-2xl p-6 md:p-8 max-w-md mx-auto">
              <form className="flex flex-col gap-3.5">
                <input type="text" name="first_name" placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" />
                <input type="email" name="email" placeholder="Email address"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/25 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" />
                <input type="hidden" name="source" value="website-lead-magnet" />
                <button type="submit"
                  className="w-full py-3.5 gradient-cta text-brand-dark font-bold rounded-xl text-sm hover:opacity-90 transition-opacity">
                  Get the Free Checklist
                </button>
              </form>
              <p className="text-[11px] text-white/20 mt-3">No spam. Just one helpful checklist.</p>
            </div>
          </FadeUp>
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
    <section className="section-padding bg-white">
      <div className="container-main max-w-3xl">
        <FadeUp className="text-center mb-12">
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary">
            Frequently Asked Questions
          </h2>
        </FadeUp>
        <div className="space-y-2.5">
          {homeFaqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.03}>
              <div className={`rounded-2xl border transition-all duration-200 ${
                open === i ? "border-brand-blue/20 shadow-[0_0_0_1px_rgba(98,196,235,0.08)]" : "border-slate-100 hover:border-slate-200"
              }`}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left"
                >
                  <span className="font-display font-600 text-[15px] text-text-primary pr-6">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brand-blue flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FINAL CTA — gradient band
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FinalCTA() {
  return (
    <section className="relative py-20 md:py-24 gradient-cta overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-1/2 left-[10%] -translate-y-1/2 w-40 h-40 rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-24 h-24 rounded-full border border-white/10 pointer-events-none" />

      <div className="container-main relative z-10 text-center">
        <FadeUp>
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-brand-dark mb-4 max-w-2xl mx-auto text-balance">
            Ready to Stop Managing Your Property&apos;s Exterior Yourself?
          </h2>
          <p className="text-brand-dark/55 mb-8 max-w-lg mx-auto">
            Request a free property assessment. We&apos;ll walk your property, scope every
            surface, and build a plan that fits your budget.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-brand-dark text-white font-semibold rounded-full hover:bg-brand-dark/90 transition-all text-sm">
              Schedule Your Free Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-brand-dark/15 text-brand-dark font-medium rounded-full hover:bg-brand-dark/[0.04] transition-all text-sm">
              <Phone className="w-4 h-4" /> {siteConfig.phone}
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CommercialServices />
      <ProblemSolution />
      <ProcessSection />
      <ResidentialBridge />
      <LeadMagnet />
      <FAQ />
      <FinalCTA />
    </>
  );
}
