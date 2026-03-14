"use client";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Building2,
  Car,
  Store,
  Home,
  Sparkles,
  Trash2,
  Check,
  CalendarCheck,
  ChevronDown,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/data";
import { FadeUp, StaggerContainer, StaggerItem } from "@/lib/animations";

const services = [
  { icon: Building2, title: "Building & Facade Washing", body: "Portland\u2019s climate accelerates mold, mildew, and algae on commercial building exteriors. Our soft wash system applies eco-friendly cleaning agents that break down organic growth at the root \u2014 then gently rinses everything away without damaging surfaces.", included: ["Full exterior soft wash", "Trim and overhang cleaning", "Eco-friendly products", "Before/after documentation"] },
  { icon: Car, title: "Parking Lots & Loading Docks", body: "Oil stains, tire marks, and grime accumulate fast on commercial hardscapes. Our hot water pressure washing system cuts through grease and embedded stains that cold water can\u2019t touch.", included: ["Hot water pressure washing", "Oil and grease stain treatment", "After-hours scheduling", "ADA walkway cleaning"] },
  { icon: Store, title: "Storefront & Retail Cleaning", body: "Your storefront is your first impression. We keep facades, sidewalks, awnings, entryways, and patio areas clean so customers walk in \u2014 not away.", included: ["Facade and awning cleaning", "Sidewalk and entryway washing", "Window exterior cleaning", "Patio area wash"] },
  { icon: Home, title: "HOA & Multi-Unit Communities", body: "Common areas take a beating. We work with HOA boards and property management companies to maintain community exteriors on a reliable schedule.", included: ["Building exterior soft wash", "Walkway pressure washing", "Fence and railing cleaning", "Gutter clearing"] },
  { icon: Sparkles, title: "Commercial Window Cleaning", body: "Our reverse osmosis water purification system delivers streak-free, spot-free results on glass up to multiple stories. No residue, no chemicals on the glass.", included: ["RO purified water system", "Interior and exterior available", "Multi-story capability", "Frame and sill wipe-down"] },
  { icon: Trash2, title: "Graffiti Removal", body: "Graffiti left untreated invites more graffiti. We remove it from brick, concrete, metal, glass, and painted surfaces using targeted chemical treatments and pressure washing.", included: ["Surface-safe treatment", "Pressure washing removal", "Protective coating (optional)", "Fast turnaround"] },
];

const tiers = [
  { name: "Monthly", description: "Ideal for high-traffic commercial properties, restaurants, and retail locations that need frequent attention.", best: "Restaurants, retail, medical offices" },
  { name: "Quarterly", description: "Covers seasonal buildup and keeps your property looking maintained throughout the year. Our most popular program.", best: "Office parks, HOA communities, multi-unit", featured: true },
  { name: "Seasonal", description: "Targeted deep cleans aligned to Portland\u2019s seasons \u2014 heavy treatment after winter, maintenance through summer and fall.", best: "Industrial, churches, schools" },
];

const faqs = [
  { q: "How much does commercial exterior cleaning cost in Portland?", a: "Costs vary based on property size, surface types, access requirements, and frequency. We provide free, detailed assessments with transparent pricing. Call (503) 704-3755 to get started." },
  { q: "Can you clean my building without disrupting tenants or customers?", a: "Absolutely. We schedule cleanings around your operations with early morning, evening, and weekend availability." },
  { q: "What\u2019s the difference between pressure washing and soft washing?", a: "Pressure washing uses high-pressure water for durable surfaces like concrete. Soft washing uses lower pressure with eco-friendly agents for siding and delicate materials. We assess each surface and use the right method." },
  { q: "Do you handle both the building and the parking lot?", a: "Yes. We handle the full exterior scope \u2014 building facades, parking lots, sidewalks, windows, gutters, and everything in between. One vendor, one plan, one invoice." },
  { q: "How do I start a recurring maintenance program?", a: "Start with a free property assessment. We walk your property, identify every surface, and build a custom schedule that fits your budget and timeline." },
];

export default function CommercialServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pb-28 gradient-mesh-dark overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-[20%] w-[400px] h-[400px] rounded-full bg-brand-blue/[0.06] blur-[100px] animate-float-slow" />
        </div>
        <div className="container-main relative z-10 text-center">
          <FadeUp>
            <span className="overline mb-3 block text-brand-blue">Commercial Services</span>
            <h1 className="font-display font-800 text-h1 tracking-display leading-display text-white mb-5 max-w-3xl mx-auto">
              Commercial Exterior Maintenance in Portland, Oregon
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
              Full-service commercial exterior cleaning. One vendor for every surface \u2014 from the parking lot to the roofline.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-blue text-white font-semibold rounded-full shadow-glow hover:shadow-glow-lg transition-all text-sm">
              Request a Free Property Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Services */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="space-y-16">
            {services.map((svc, i) => (
              <FadeUp key={svc.title} delay={0.05}>
                <div className={`grid md:grid-cols-2 gap-10 items-start ${i % 2 === 1 ? "md:direction-rtl" : ""}`}>
                  <div className={i % 2 === 1 ? "md:order-2" : ""}>
                    <div className="w-12 h-12 bg-brand-blue-50 rounded-xl flex items-center justify-center mb-4">
                      <svc.icon className="w-6 h-6 text-brand-blue" />
                    </div>
                    <h2 className="font-display font-700 text-2xl text-text-primary mb-3">{svc.title}</h2>
                    <p className="text-text-secondary leading-relaxed mb-5">{svc.body}</p>
                    <ul className="space-y-2">
                      {svc.included.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-text-secondary">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`bg-surface-alt rounded-2xl aspect-[4/3] flex items-center justify-center ${i % 2 === 1 ? "md:order-1" : ""}`}>
                    <span className="text-text-muted text-sm">[Photo placeholder]</span>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Recurring Programs */}
      <section className="section-padding bg-surface-alt">
        <div className="container-main">
          <FadeUp className="text-center mb-12">
            <span className="overline mb-3 block">Maintenance Programs</span>
            <h2 className="font-display font-800 text-h2 tracking-heading text-text-primary mb-3">Recurring Maintenance That Runs Itself</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">One-off cleanings solve a problem for a week. Recurring maintenance programs solve it for good.</p>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <div className={`p-7 rounded-2xl h-full flex flex-col ${tier.featured ? "bg-brand-dark text-white ring-2 ring-brand-blue" : "bg-white border border-slate-100"}`}>
                  {tier.featured && <span className="inline-block px-3 py-1 bg-brand-blue/15 text-brand-blue text-xs font-semibold rounded-full mb-4 w-fit">Most Popular</span>}
                  <h3 className={`font-display font-700 text-xl mb-2 ${tier.featured ? "text-white" : "text-text-primary"}`}>{tier.name}</h3>
                  <p className={`text-sm leading-relaxed mb-4 flex-1 ${tier.featured ? "text-white/60" : "text-text-secondary"}`}>{tier.description}</p>
                  <p className={`text-xs ${tier.featured ? "text-white/40" : "text-text-muted"}`}>Best for: {tier.best}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeUp delay={0.2} className="text-center mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-semibold rounded-full shadow-glow hover:shadow-glow-lg transition-all text-sm">
              Get a Custom Maintenance Plan <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <FadeUp className="text-center mb-12">
            <h2 className="font-display font-800 text-h2 tracking-heading text-text-primary">Commercial Services FAQ</h2>
          </FadeUp>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-alt transition-colors">
                  <span className="font-display font-600 text-sm text-text-primary pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 gradient-cta">
        <div className="container-main text-center">
          <FadeUp>
            <h2 className="font-display font-800 text-h2 tracking-heading text-brand-dark mb-4 max-w-2xl mx-auto">Your Property Deserves a Maintenance Plan That Actually Works.</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-dark text-white font-semibold rounded-full transition-all text-sm">Schedule Your Free Assessment <ArrowRight className="w-4 h-4" /></Link>
              <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 px-7 py-3.5 border border-brand-dark/20 text-brand-dark font-medium rounded-full transition-all text-sm"><Phone className="w-4 h-4" />{siteConfig.phone}</a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
