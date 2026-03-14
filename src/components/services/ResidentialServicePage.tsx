"use client";
import Link from "next/link";
import { ArrowRight, Phone, Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { site } from "@/lib/data";
import { FadeIn, SlideIn } from "@/lib/animations";

interface Props {
  overline?: string; headline: string; subheadline: string; badge?: string;
  problemHeadline: string; problemBody: string; definition?: string;
  included: string[]; statNote?: string;
  processSteps?: { num: string; title: string; body: string }[];
  faqs: { q: string; a: string }[]; ctaLine: string;
}

export function ResidentialServicePage(p: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <>
      <section className="pt-28 pb-16 bg-surface-alt relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-blue/[0.03] rounded-full blur-[80px] pointer-events-none" />
        <div className="container-site relative z-10 text-center">
          <FadeIn>
            <span className="overline mb-4 block">{p.overline || "Residential Services"}</span>
            <h1 className="font-display font-800 text-display-lg text-brand-black mb-5 max-w-3xl mx-auto">{p.headline}</h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-6">{p.subheadline}</p>
            {p.badge && <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/[0.06] text-brand-blue text-xs font-semibold rounded-full mb-6">{p.badge}</span>}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2">
              <Link href="/contact" className="btn-primary group">Get a Free Quote <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" /></Link>
              <a href={site.phoneHref} className="btn-outline"><Phone className="w-4 h-4" />{site.phone}</a>
            </div>
          </FadeIn>
        </div>
      </section>
      <section className="section-gap bg-white">
        <div className="container-site"><div className="grid md:grid-cols-2 gap-12 items-start">
          <SlideIn from="left">
            <h2 className="font-display font-800 text-display text-brand-black mb-5">{p.problemHeadline}</h2>
            {p.definition && <div className="p-4 bg-brand-blue/[0.04] border-l-2 border-brand-blue rounded-r-xl mb-5"><p className="text-sm text-text-secondary">{p.definition}</p></div>}
            <div className="text-text-secondary leading-relaxed space-y-4">{p.problemBody.split("\n\n").map((para,i)=><p key={i}>{para}</p>)}</div>
            {p.statNote && <p className="mt-5 text-xs text-text-muted italic">{p.statNote}</p>}
          </SlideIn>
          <SlideIn from="right" delay={0.1}>
            <div className="bg-surface-card rounded-3xl p-7 border border-border-light">
              <h3 className="font-display font-700 text-lg text-brand-black mb-5">What&apos;s Included</h3>
              <ul className="space-y-3">{p.included.map((item)=><li key={item} className="flex items-start gap-3 text-sm text-text-secondary"><Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0"/>{item}</li>)}</ul>
            </div>
          </SlideIn>
        </div></div>
      </section>
      {p.processSteps && <section className="section-gap bg-surface-alt"><div className="container-site"><FadeIn className="text-center mb-12"><span className="overline mb-4 block">How It Works</span></FadeIn><div className="grid md:grid-cols-3 gap-10">{p.processSteps.map((s)=>(<FadeIn key={s.num}><div className="text-center"><span className="font-mono font-bold text-[64px] leading-none text-brand-blue/[0.06] block">{s.num}</span><h3 className="font-display font-700 text-lg text-brand-black mb-2 -mt-8 relative z-10">{s.title}</h3><p className="text-sm text-text-secondary">{s.body}</p></div></FadeIn>))}</div></div></section>}
      <section className={`section-gap ${p.processSteps?"bg-white":"bg-surface-alt"}`}><div className="container-site max-w-3xl">
        <FadeIn className="text-center mb-10"><h2 className="font-display font-700 text-display-sm text-brand-black">Frequently Asked Questions</h2></FadeIn>
        <div className="space-y-2.5">{p.faqs.map((faq,i)=>(
          <div key={i} className="rounded-2xl border border-border overflow-hidden bg-white">
            <button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center justify-between p-5 text-left">
              <span className="font-display font-600 text-[15px] text-brand-black pr-4">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-brand-blue flex-shrink-0 transition-transform ${openFaq===i?"rotate-180":""}`}/>
            </button>
            <AnimatePresence initial={false}>{openFaq===i&&(<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.25}} className="overflow-hidden"><p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">{faq.a}</p></motion.div>)}</AnimatePresence>
          </div>
        ))}</div>
      </div></section>
      <section className="py-20 gradient-cta"><div className="container-site text-center"><FadeIn>
        <h2 className="font-display font-800 text-display text-brand-black mb-6 max-w-2xl mx-auto">{p.ctaLine}</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/contact" className="btn-dark group">Get a Free Quote <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5"/></Link>
          <a href={site.phoneHref} className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-brand-dark/15 text-brand-dark text-sm font-semibold rounded-full hover:bg-brand-dark/[0.04] transition-all"><Phone className="w-4 h-4"/>{site.phone}</a>
        </div>
      </FadeIn></div></section>
    </>
  );
}
