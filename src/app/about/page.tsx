"use client";
import Link from "next/link";
import { ArrowRight, Phone, Leaf, Wrench, MapPin, CalendarCheck, Building2, Shield, Droplets } from "lucide-react";
import { siteConfig } from "@/lib/data";
import { FadeUp, StaggerContainer, StaggerItem } from "@/lib/animations";

const differentiators = [
  { icon: Wrench, title: "Full-Scope Maintenance", description: "Building, parking lot, windows, gutters, roof — we handle every exterior surface with one team and one plan." },
  { icon: MapPin, title: "PNW Climate Expertise", description: "Our methods and products are built for Oregon\u2019s specific challenges: moss, algae, mold, and constant moisture." },
  { icon: Leaf, title: "Eco-Friendly by Default", description: "Every cleaning product we use is biodegradable and safe for Portland\u2019s waterways. Not an upsell — the standard." },
  { icon: CalendarCheck, title: "Recurring Programs", description: "We build custom schedules so your property stays maintained without you managing it." },
];

const stats = [
  { label: "Years Serving Portland", value: "[CLIENT TO PROVIDE]" },
  { label: "Oregon Licensed & Insured", value: "[CLIENT TO PROVIDE: CCB#]" },
  { label: "Eco-Friendly Products", value: "100%" },
  { label: "Locally Owned & Operated", value: "Portland, OR" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-surface-alt">
        <div className="container-main text-center">
          <FadeUp>
            <h1 className="font-display font-800 text-h1 tracking-display leading-heading text-text-primary mb-4">About Rinse It Off</h1>
            <p className="text-text-secondary text-lg max-w-lg mx-auto">Portland&apos;s commercial exterior cleaning specialists.</p>
          </FadeUp>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-white">
        <div className="container-main max-w-3xl">
          <FadeUp>
            <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary mb-6 text-center">
              Built for Portland. <span className="text-brand-blue">Built Different.</span>
            </h2>
            <div className="prose prose-slate max-w-none text-text-secondary leading-relaxed space-y-5">
              <p>
                Rinse It Off is a Portland-based commercial pressure washing and exterior cleaning company. We specialize in maintaining commercial properties — storefronts, office buildings, HOA communities, parking lots, and industrial facilities — with recurring maintenance programs that keep exteriors clean, safe, and professional year-round.
              </p>
              <p>
                We also serve Portland homeowners with the same professional-grade methods: gentle soft wash house cleaning, roof and gutter treatment, concrete restoration, deck cleaning, and streak-free window washing.
              </p>
              <p>
                Every product we use is eco-friendly and biodegradable — formulated specifically for the Pacific Northwest climate and safe for Portland&apos;s waterways. We know what Oregon&apos;s rain, moss, and algae do to buildings because we live here too.
              </p>
              <p className="text-brand-blue/80 italic border-l-2 border-brand-blue/20 pl-4">
                [CLIENT TO PROVIDE: Founder story, years in business, team background, personal motivation for starting the company.]
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Differentiators */}
      <section className="section-padding bg-surface-alt">
        <div className="container-main">
          <FadeUp className="text-center mb-12">
            <h2 className="font-display font-800 text-h2 tracking-heading text-text-primary">What Sets Us Apart</h2>
          </FadeUp>
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {differentiators.map((d) => (
              <StaggerItem key={d.title}>
                <div className="bg-white p-7 rounded-2xl border border-slate-100 hover-lift h-full">
                  <div className="w-11 h-11 bg-brand-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <d.icon className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="font-display font-700 text-lg text-text-primary mb-2">{d.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{d.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="container-main">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <FadeUp key={stat.label}>
                <div className="text-center">
                  <p className="font-display font-800 text-xl text-brand-blue mb-1">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-cta">
        <div className="container-main text-center">
          <FadeUp>
            <h2 className="font-display font-800 text-h2 tracking-heading text-brand-dark mb-4">Let&apos;s Talk About Your Property.</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-dark text-white font-semibold rounded-full transition-all text-sm">Get a Free Assessment <ArrowRight className="w-4 h-4" /></Link>
              <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 px-7 py-3.5 border border-brand-dark/20 text-brand-dark font-medium rounded-full transition-all text-sm"><Phone className="w-4 h-4" />{siteConfig.phone}</a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
