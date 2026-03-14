"use client";
import Link from "next/link";
import { ArrowRight, Phone, Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { siteConfig } from "@/lib/data";
import { FadeUp, StaggerContainer, StaggerItem } from "@/lib/animations";

interface ServicePageProps {
  overline?: string;
  headline: string;
  subheadline: string;
  badge?: string;
  problemHeadline: string;
  problemBody: string;
  definition?: string;
  included: string[];
  industryStatNote?: string;
  processSteps?: { number: string; title: string; description: string }[];
  faqs: { q: string; a: string }[];
  ctaHeadline: string;
}

export function ResidentialServicePage({
  overline = "Residential Services",
  headline,
  subheadline,
  badge,
  problemHeadline,
  problemBody,
  definition,
  included,
  industryStatNote,
  processSteps,
  faqs,
  ctaHeadline,
}: ServicePageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pb-20 bg-surface-alt relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-blue/[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="container-main relative z-10 text-center">
          <FadeUp>
            <span className="overline mb-3 block">{overline}</span>
            <h1 className="font-display font-800 text-h1 tracking-display leading-heading text-text-primary mb-5 max-w-3xl mx-auto">
              {headline}
            </h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-6">
              {subheadline}
            </p>
            {badge && (
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-mint-100 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-200/50">
                  {badge}
                </span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-blue text-white font-semibold rounded-full shadow-glow hover:shadow-glow-lg hover:bg-brand-blue-dark transition-all text-sm">
                Get a Free Quote <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-brand-blue transition-colors">
                <Phone className="w-4 h-4" /> {siteConfig.phone}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <FadeUp>
              <h2 className="font-display font-800 text-h2 tracking-heading leading-heading text-text-primary mb-5">{problemHeadline}</h2>
              {definition && (
                <div className="p-4 bg-brand-blue-50 border-l-2 border-brand-blue rounded-r-xl mb-5">
                  <p className="text-sm text-text-secondary leading-relaxed">{definition}</p>
                </div>
              )}
              <div className="text-text-secondary leading-relaxed space-y-4">
                {problemBody.split("\n\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {industryStatNote && (
                <p className="mt-5 text-xs text-text-muted italic">{industryStatNote}</p>
              )}
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="bg-surface-alt rounded-2xl p-7 border border-slate-100">
                <h3 className="font-display font-700 text-lg text-text-primary mb-5">What&apos;s Included</h3>
                <ul className="space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Process Steps (if provided) */}
      {processSteps && (
        <section className="section-padding bg-surface-alt">
          <div className="container-main">
            <FadeUp className="text-center mb-12">
              <span className="overline mb-3 block">How It Works</span>
              <h2 className="font-display font-700 text-2xl text-text-primary">Simple as 1-2-3</h2>
            </FadeUp>
            <StaggerContainer className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {processSteps.map((step, i) => (
                <StaggerItem key={step.number}>
                  <div className="relative">
                    <span className="font-mono font-bold text-5xl text-brand-blue/15 block mb-3">{step.number}</span>
                    <h3 className="font-display font-700 text-lg text-text-primary mb-2">{step.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
                    {i < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 -right-6 lg:-right-8 w-8 lg:w-12 border-t border-dashed border-brand-blue/15" />
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className={`section-padding ${processSteps ? "bg-white" : "bg-surface-alt"}`}>
        <div className="container-main max-w-3xl">
          <FadeUp className="text-center mb-10">
            <h2 className="font-display font-700 text-2xl text-text-primary">Frequently Asked Questions</h2>
          </FadeUp>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`border border-slate-100 rounded-xl overflow-hidden ${processSteps ? "bg-white" : "bg-white"}`}>
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

      {/* CTA */}
      <section className="py-20 gradient-cta">
        <div className="container-main text-center">
          <FadeUp>
            <h2 className="font-display font-800 text-h2 tracking-heading text-brand-dark mb-4 max-w-2xl mx-auto">{ctaHeadline}</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-dark text-white font-semibold rounded-full transition-all text-sm">Get a Free Quote <ArrowRight className="w-4 h-4" /></Link>
              <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 px-7 py-3.5 border border-brand-dark/20 text-brand-dark font-medium rounded-full transition-all text-sm"><Phone className="w-4 h-4" />{siteConfig.phone}</a>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
