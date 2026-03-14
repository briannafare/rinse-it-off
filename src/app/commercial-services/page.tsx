"use client";
import Link from "next/link";
import { ArrowRight, Phone, Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "@/lib/data";
import { FadeIn, Stagger, StaggerChild, SlideIn } from "@/lib/animations";
import { ServiceIcon } from "@/components/shared/WaterIllustrations";

const svcDetails = [
  { icon: "building", title: "Building & Facade Washing", body: "Portland\u2019s climate accelerates mold, mildew, and algae on commercial building exteriors. Our soft wash system applies eco-friendly cleaning agents that break down organic growth at the root \u2014 then gently rinses away without damaging surfaces.", included: ["Full exterior soft wash","Trim and overhang cleaning","Eco-friendly products","Before/after documentation"] },
  { icon: "truck", title: "Parking Lots & Loading Docks", body: "Oil stains, tire marks, and grime accumulate fast on commercial hardscapes. Our hot water pressure washing system cuts through grease and embedded stains that cold water can\u2019t touch.", included: ["Hot water pressure washing","Oil and grease treatment","After-hours scheduling","ADA walkway cleaning"] },
  { icon: "store", title: "Storefront & Retail", body: "Your storefront is your first impression. We keep facades, sidewalks, awnings, entryways, and patio areas clean so customers walk in \u2014 not away.", included: ["Facade and awning cleaning","Sidewalk washing","Window exterior cleaning","Patio area wash"] },
  { icon: "homes", title: "HOA & Multi-Unit", body: "Common areas take a beating. We work with HOA boards and property management companies to maintain community exteriors on a reliable schedule.", included: ["Building exterior soft wash","Walkway pressure washing","Fence and railing cleaning","Gutter clearing"] },
  { icon: "sparkle", title: "Commercial Window Cleaning", body: "Our reverse osmosis water purification system delivers streak-free, spot-free results on glass up to multiple stories. No residue, no chemicals on the glass.", included: ["RO purified water system","Interior and exterior","Multi-story capability","Frame and sill wipe-down"] },
];

const tiers = [
  { name: "Monthly", desc: "Ideal for high-traffic commercial properties, restaurants, and retail that need frequent attention.", best: "Restaurants, retail, medical offices", featured: false },
  { name: "Quarterly", desc: "Covers seasonal buildup and keeps your property maintained year-round. Our most popular program.", best: "Office parks, HOA communities, multi-unit", featured: true },
  { name: "Seasonal", desc: "Targeted deep cleans aligned to Portland\u2019s seasons \u2014 heavy treatment after winter, maintenance through summer.", best: "Industrial, churches, schools", featured: false },
];

const faqs = [
  { q: "How much does commercial exterior cleaning cost in Portland?", a: "Costs vary by property size, surface types, and frequency. We provide free assessments with transparent pricing. Call (503) 704-3755 to start." },
  { q: "Can you clean without disrupting tenants or customers?", a: "Yes. We schedule around your operations with early morning, evening, and weekend availability." },
  { q: "What\u2019s the difference between pressure washing and soft washing?", a: "Pressure washing uses high-pressure water for durable surfaces like concrete. Soft washing uses lower pressure with eco-friendly agents for siding and delicate materials. We use the right method for each surface." },
  { q: "Do you handle both the building and parking lot?", a: "Yes \u2014 that\u2019s one of the main reasons property managers choose us. Full exterior scope, one vendor, one invoice." },
  { q: "How do I start a recurring maintenance program?", a: "Request a free property assessment. We\u2019ll walk your property, identify every surface, and build a custom schedule that fits your budget." },
];

export default function CommercialPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-surface-alt relative overflow-hidden">
        <div className="absolute -top-20 right-[10%] w-80 h-80 bg-brand-blue/[0.04] rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="container-site relative z-10 text-center">
          <FadeIn>
            <span className="overline mb-4 block">Commercial Services</span>
            <h1 className="font-display font-800 text-display-lg text-brand-black mb-5 max-w-3xl mx-auto">Commercial Exterior Maintenance in Portland, Oregon</h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-8">Full-service commercial exterior cleaning. One vendor for every surface \u2014 from the parking lot to the roofline.</p>
            <Link href="/contact" className="btn-primary group">Request a Free Property Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></Link>
          </FadeIn>
        </div>
      </section>

      {/* Services Detail */}
      <section className="section-gap bg-white">
        <div className="container-site">
          <div className="space-y-20">
            {svcDetails.map((svc, i) => (
              <div key={svc.title} className="grid md:grid-cols-2 gap-10 items-start">
                <SlideIn from={i % 2 === 0 ? "left" : "right"} className={i % 2 === 1 ? "md:order-2" : ""}>
                  <ServiceIcon type={svc.icon} className="w-12 h-12 mb-4" />
                  <h2 className="font-display font-700 text-display-sm text-brand-black mb-3">{svc.title}</h2>
                  <p className="text-text-secondary leading-relaxed mb-5">{svc.body}</p>
                  <ul className="space-y-2">{svc.included.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-text-secondary"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />{item}</li>
                  ))}</ul>
                </SlideIn>
                <SlideIn from={i % 2 === 0 ? "right" : "left"} delay={0.1} className={i % 2 === 1 ? "md:order-1" : ""}>
                  <div className="bg-surface-alt rounded-3xl aspect-[4/3] flex items-center justify-center border border-border-light">
                    <div className="text-center"><ServiceIcon type={svc.icon} className="w-16 h-16 mx-auto mb-3 opacity-20" /><span className="text-text-muted text-sm">[Photo placeholder]</span></div>
                  </div>
                </SlideIn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recurring Programs */}
      <section className="section-gap bg-surface-alt">
        <div className="container-site">
          <FadeIn className="text-center mb-12">
            <span className="overline mb-4 block">Maintenance Programs</span>
            <h2 className="font-display font-800 text-display text-brand-black mb-3">Recurring Maintenance That Runs Itself</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">One-off cleanings solve a problem for a week. Recurring maintenance solves it for good.</p>
          </FadeIn>
          <Stagger className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <StaggerChild key={tier.name}>
                <div className={`p-7 rounded-3xl h-full flex flex-col transition-all ${
                  tier.featured ? "bg-brand-black text-white ring-2 ring-brand-blue shadow-soft-lg" : "bg-white border border-border-light hover-lift"
                }`}>
                  {tier.featured && <span className="inline-block px-3 py-1 bg-brand-blue/15 text-brand-blue text-xs font-semibold rounded-full mb-4 w-fit">Most Popular</span>}
                  <h3 className={`font-display font-700 text-xl mb-2 ${tier.featured ? "text-white" : "text-brand-black"}`}>{tier.name}</h3>
                  <p className={`text-sm leading-relaxed mb-4 flex-1 ${tier.featured ? "text-white/55" : "text-text-secondary"}`}>{tier.desc}</p>
                  <p className={`text-xs ${tier.featured ? "text-white/35" : "text-text-muted"}`}>Best for: {tier.best}</p>
                </div>
              </StaggerChild>
            ))}
          </Stagger>
          <FadeIn delay={0.2} className="text-center mt-10">
            <Link href="/contact" className="btn-primary group">Get a Custom Maintenance Plan <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></Link>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-gap bg-white">
        <div className="container-site max-w-3xl">
          <FadeIn className="text-center mb-12"><h2 className="font-display font-800 text-display text-brand-black">Commercial Services FAQ</h2></FadeIn>
          <div className="space-y-2.5">{faqs.map((faq, i) => (
            <div key={i} className={`rounded-2xl border overflow-hidden transition-all ${openFaq === i ? "border-brand-blue/25" : "border-border hover:border-brand-blue/15"}`}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-display font-600 text-[15px] text-brand-black pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-brand-blue flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>{openFaq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                </motion.div>
              )}</AnimatePresence>
            </div>
          ))}</div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-cta"><div className="container-site text-center"><FadeIn>
        <h2 className="font-display font-800 text-display text-brand-black mb-6 max-w-2xl mx-auto">Your Property Deserves a Maintenance Plan That Actually Works.</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn-dark group">Schedule Your Free Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></Link>
          <a href={site.phoneHref} className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-brand-dark/15 text-brand-dark text-sm font-semibold rounded-full transition-all"><Phone className="w-4 h-4" />{site.phone}</a>
        </div>
      </FadeIn></div></section>
    </>
  );
}
