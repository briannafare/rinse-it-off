"use client";
import Link from "next/link";
import { ArrowRight, Phone, Leaf, Wrench, MapPin, CalendarCheck } from "lucide-react";
import { site } from "@/lib/data";
import { FadeIn, Stagger, StaggerChild } from "@/lib/animations";

const diffs = [
  { icon: Wrench, title: "Full-Scope Maintenance", desc: "Building, parking lot, windows, gutters, roof \u2014 one team, one plan." },
  { icon: MapPin, title: "PNW Climate Expertise", desc: "Methods and products built for Oregon\u2019s moss, algae, and constant moisture." },
  { icon: Leaf, title: "Eco-Friendly by Default", desc: "Biodegradable products safe for Portland\u2019s waterways. Not an upsell \u2014 the standard." },
  { icon: CalendarCheck, title: "Recurring Programs", desc: "Custom schedules so your property stays maintained without you managing it." },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-28 pb-16 bg-surface-alt"><div className="container-site text-center"><FadeIn>
        <h1 className="font-display font-800 text-display-lg text-brand-black mb-4">About Rinse It Off</h1>
        <p className="text-text-secondary text-lg">Portland&apos;s commercial exterior cleaning specialists.</p>
      </FadeIn></div></section>

      <section className="section-gap bg-white"><div className="container-site max-w-3xl"><FadeIn>
        <h2 className="font-display font-800 text-display text-brand-black mb-6 text-center">Built for Portland. <span className="text-gradient-blue">Built Different.</span></h2>
        <div className="text-text-secondary leading-relaxed space-y-5">
          <p>Rinse It Off is a Portland-based commercial pressure washing and exterior cleaning company. We specialize in maintaining commercial properties &mdash; storefronts, office buildings, HOA communities, parking lots, and industrial facilities &mdash; with recurring maintenance programs that keep exteriors clean, safe, and professional year-round.</p>
          <p>We also serve Portland homeowners with the same professional-grade methods: gentle soft wash house cleaning, roof and gutter treatment, concrete restoration, deck cleaning, and streak-free window washing.</p>
          <p>Every product we use is eco-friendly and biodegradable &mdash; formulated specifically for the Pacific Northwest climate and safe for Portland&apos;s waterways.</p>
          <p className="text-brand-blue/70 italic border-l-2 border-brand-blue/20 pl-4">[CLIENT TO PROVIDE: Founder story, years in business, team background.]</p>
        </div>
      </FadeIn></div></section>

      <section className="section-gap bg-surface-alt"><div className="container-site">
        <FadeIn className="text-center mb-12"><h2 className="font-display font-800 text-display text-brand-black">What Sets Us Apart</h2></FadeIn>
        <Stagger className="grid md:grid-cols-2 gap-6">{diffs.map((d) => (
          <StaggerChild key={d.title}><div className="bg-white p-7 rounded-3xl border border-border-light hover-lift h-full">
            <d.icon className="w-8 h-8 text-brand-blue mb-4" strokeWidth={1.5} />
            <h3 className="font-display font-700 text-lg text-brand-black mb-2">{d.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{d.desc}</p>
          </div></StaggerChild>
        ))}</Stagger>
      </div></section>

      <section className="py-20 gradient-cta"><div className="container-site text-center"><FadeIn>
        <h2 className="font-display font-800 text-display text-brand-black mb-6">Let&apos;s Talk About Your Property.</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn-dark group">Get a Free Assessment <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></Link>
          <a href={site.phoneHref} className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-brand-dark/15 text-brand-dark text-sm font-semibold rounded-full transition-all"><Phone className="w-4 h-4" />{site.phone}</a>
        </div>
      </FadeIn></div></section>
    </>
  );
}
