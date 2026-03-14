"use client";
import Link from "next/link";
import {
  Building2,
  Car,
  Store,
  Home,
  Sparkles,
  CalendarCheck,
  ArrowRight,
  Phone,
  Check,
  X as XIcon,
  Droplets,
  Shield,
  Leaf,
  ChevronDown,
  Mail,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  siteConfig,
  commercialServices,
  processSteps,
  painPoints,
  homeFaqs,
  residentialLinks,
} from "@/lib/data";
import { FadeUp, StaggerContainer, StaggerItem } from "@/lib/animations";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  Car,
  Store,
  Home,
  Sparkles,
  CalendarCheck,
};

/* ─────────────────────── HERO ─────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh-dark">
      {/* Floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-[15%] w-[500px] h-[500px] rounded-full bg-brand-blue/[0.07] blur-[120px] animate-float-slow" />
        <div className="absolute bottom-1/3 right-[10%] w-[400px] h-[400px] rounded-full bg-brand-mint/[0.04] blur-[100px] animate-float-slower" />
      </div>

      <div className="container-main relative z-10 text-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full text-brand-blue text-xs font-semibold tracking-overline uppercase mb-8">
            <Droplets className="w-3.5 h-3.5" />
            Portland&apos;s Commercial Exterior Specialists
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display font-800 text-hero text-white tracking-display leading-display max-w-4xl mx-auto mb-6"
        >
          Your Property.{" "}
          <span className="text-gradient">Our Problem.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Rinse It Off is a Portland-based commercial pressure washing and exterior
          cleaning company. We maintain storefronts, office parks, HOA communities,
          and industrial facilities — so your property always makes the right first
          impression.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-blue text-white font-semibold rounded-full shadow-glow hover:shadow-glow-lg hover:bg-brand-blue-dark transition-all duration-300 text-sm"
          >
            Get a Free Property Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={siteConfig.phoneHref}
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/15 text-white/80 hover:text-white hover:border-white/30 font-medium rounded-full transition-all duration-300 text-sm"
          >
            <Phone className="w-4 h-4" />
            {siteConfig.phone}
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

/* ─────────────────── TRUST STRIP ─────────────────── */
function TrustStrip() {
  const stats = [
    { icon: Building2, label: "Commercial Properties", value: "Portland Metro" },
    { icon: Shield, label: "Licensed & Insured", value: "✓" },
    { icon: Leaf, label: "Eco-Friendly Products", value: "100%" },
    { icon: Droplets, label: "Satisfaction Guaranteed", value: "Always" },
  ];

  return (
    <section className="py-10 border-b border-slate-100">
      <div className="container-main">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8" stagger={0.1}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-blue-50 rounded-xl flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-brand-blue" />
              </div>
              <div>
                <p className="font-display font-700 text-text-primary text-sm">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ─────────────── COMMERCIAL BENTO GRID ─────────────── */
function CommercialServices() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <FadeUp className="text-center mb-14">
          <span className="overline mb-3 block">Commercial Services</span>
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary mb-4">
            One Vendor. Every Surface.{" "}
            <span className="text-brand-blue">Year-Round.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stop juggling multiple contractors. Rinse It Off handles your entire
            exterior — from the parking lot to the roofline — with one point of
            contact and one maintenance plan.
          </p>
        </FadeUp>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          stagger={0.06}
        >
          {commercialServices.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <StaggerItem
                key={service.title}
                className={service.featured ? "md:col-span-2 lg:col-span-2" : ""}
              >
                <div
                  className={`group relative h-full p-7 rounded-2xl border transition-all duration-300 hover-lift cursor-pointer ${
                    service.featured
                      ? "bg-brand-dark text-white border-brand-dark"
                      : "bg-surface-alt border-slate-100 hover:border-brand-blue/30"
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                      service.featured
                        ? "bg-brand-blue/15"
                        : "bg-brand-blue-50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        service.featured ? "text-brand-blue" : "text-brand-blue"
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-display font-700 text-lg mb-2 ${
                      service.featured ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {service.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      service.featured ? "text-white/60" : "text-text-secondary"
                    }`}
                  >
                    {service.description}
                  </p>
                  {service.featured && (
                    <span className="inline-flex items-center gap-1 mt-4 text-brand-blue text-sm font-semibold">
                      Our most popular program <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeUp delay={0.3} className="text-center mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-full shadow-glow hover:shadow-glow-lg hover:bg-brand-blue-dark transition-all duration-300 text-sm"
          >
            Request a Free Assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

/* ────────────── PROBLEM / SOLUTION ────────────── */
function ProblemSolution() {
  return (
    <section className="section-padding bg-surface-alt">
      <div className="container-main max-w-3xl">
        <FadeUp>
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary text-center mb-6">
            Tired of Vendors Who{" "}
            <span className="text-brand-blue">Don&apos;t Show Up?</span>
          </h2>
          <p className="text-text-secondary text-lg text-center leading-relaxed mb-10">
            If you manage commercial property in Portland, you already know the frustration.
            The vendor who ghosts after the first job. The crew that does half the work and
            sends a full invoice.
          </p>
        </FadeUp>

        <div className="grid md:grid-cols-2 gap-8">
          <FadeUp delay={0.1}>
            <div className="p-6 bg-white rounded-2xl border border-red-100/50">
              <h3 className="font-display font-700 text-sm text-red-400 mb-4 uppercase tracking-wide">
                The Problem
              </h3>
              <ul className="space-y-3">
                {painPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm text-text-secondary">
                    <XIcon className="w-4 h-4 text-red-300 mt-0.5 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="p-6 bg-white rounded-2xl border border-emerald-100/50">
              <h3 className="font-display font-700 text-sm text-emerald-500 mb-4 uppercase tracking-wide">
                Our Solution
              </h3>
              <ul className="space-y-3">
                {[
                  "One vendor for your full exterior scope",
                  "Custom maintenance plans that run on schedule",
                  "Clear communication — no ghosting, no surprises",
                  "Eco-friendly methods built for Portland's climate",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm text-text-secondary">
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

/* ────────────── PROCESS STEPS ────────────── */
function ProcessSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <FadeUp className="text-center mb-14">
          <span className="overline mb-3 block">How It Works</span>
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary">
            Three Steps to a Maintained Property
          </h2>
        </FadeUp>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {processSteps.map((step, i) => (
            <StaggerItem key={step.number}>
              <div className="relative">
                <span className="font-mono font-bold text-5xl text-brand-blue/15 block mb-3">
                  {step.number}
                </span>
                <h3 className="font-display font-700 text-lg text-text-primary mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.description}
                </p>
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-6 lg:-right-8 w-8 lg:w-12 border-t border-dashed border-brand-blue/15" />
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeUp delay={0.3} className="text-center mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-full shadow-glow hover:shadow-glow-lg hover:bg-brand-blue-dark transition-all duration-300 text-sm"
          >
            Start with a Free Assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}

/* ────────────── RESIDENTIAL BRIDGE ────────────── */
function ResidentialBridge() {
  return (
    <section className="section-padding bg-gradient-to-b from-brand-blue-50 to-white">
      <div className="container-main text-center">
        <FadeUp>
          <span className="overline mb-3 block">Residential Services</span>
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary mb-4">
            Portland Homeowners — We&apos;ve Got You Too.
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">
            Rinse It Off also serves Portland homeowners with the same professional-grade
            cleaning we bring to commercial properties.
          </p>
        </FadeUp>

        <StaggerContainer className="flex flex-wrap items-center justify-center gap-3" stagger={0.06}>
          {residentialLinks.map((link) => (
            <StaggerItem key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-text-primary hover:border-brand-blue hover:text-brand-blue hover:shadow-soft transition-all duration-300"
              >
                {link.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ────────────── LEAD MAGNET ────────────── */
function LeadMagnet() {
  return (
    <section className="section-padding bg-brand-dark relative overflow-hidden">
      {/* Subtle orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-blue/[0.04] blur-[120px] pointer-events-none" />

      <div className="container-main relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <FadeUp>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.06] border border-white/[0.08] rounded-full text-brand-blue text-xs font-semibold tracking-overline uppercase mb-6">
              <Download className="w-3.5 h-3.5" />
              Free Resource
            </span>
            <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-white mb-4">
              Commercial Property Maintenance Checklist
            </h2>
            <p className="text-white/50 mb-8 leading-relaxed">
              A seasonal guide for Portland property managers. Know exactly what exterior
              maintenance your property needs — and when.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <form className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="first_name"
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder:text-white/30 text-sm focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all"
                />
              </div>
              <input type="hidden" name="source" value="website-lead-magnet" />
              <button
                type="submit"
                className="w-full py-3 gradient-cta text-brand-dark font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                Get the Free Checklist
              </button>
              <p className="text-xs text-white/25 mt-1">
                No spam. Just one helpful checklist delivered to your inbox.
              </p>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ────────────── FAQ ────────────── */
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

        <div className="space-y-3">
          {homeFaqs.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.04}>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-alt transition-colors"
                >
                  <span className="font-display font-600 text-sm text-text-primary pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${
                      open === i ? "rotate-180" : ""
                    }`}
                  />
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
                      <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                        {faq.a}
                      </p>
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

/* ────────────── FINAL CTA ────────────── */
function FinalCTA() {
  return (
    <section className="py-20 md:py-24 gradient-cta">
      <div className="container-main text-center">
        <FadeUp>
          <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-brand-dark mb-4 max-w-2xl mx-auto">
            Ready to Stop Worrying About Your Property&apos;s Exterior?
          </h2>
          <p className="text-brand-dark/60 mb-8 max-w-lg mx-auto">
            Request a free property assessment and find out what a real maintenance program looks like.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-dark text-white font-semibold rounded-full hover:bg-brand-dark/90 transition-all text-sm"
            >
              Schedule Your Free Assessment <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-brand-dark/20 text-brand-dark font-medium rounded-full hover:bg-brand-dark/5 transition-all text-sm"
            >
              <Phone className="w-4 h-4" />
              {siteConfig.phone}
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ────────────── PAGE ────────────── */
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
