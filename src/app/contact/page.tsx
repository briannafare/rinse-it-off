"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/lib/data";
import { FadeUp } from "@/lib/animations";

const faqs = [
  { q: "How fast will I hear back after submitting the form?", a: "We typically respond within 24 hours during business days. For faster service, call us directly at (503) 704-3755." },
  { q: "Do I need to be home during the cleaning?", a: "Not usually. For exterior cleaning, we just need access to the property and an outdoor water spigot. We\u2019ll coordinate specifics when we schedule." },
  { q: "Do you provide free estimates?", a: "Yes. Every assessment and quote is free with no obligation. For commercial properties, we schedule a walkthrough. For residential, we can often quote from photos and property details." },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-surface-alt">
        <div className="container-main text-center">
          <FadeUp>
            <h1 className="font-display font-800 text-h1 tracking-display leading-heading text-text-primary mb-4">
              Get in Touch
            </h1>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Whether you manage a commercial property or want your home&apos;s exterior restored — we&apos;re ready to help.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Contact Split */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Info */}
            <FadeUp>
              <div>
                <h2 className="font-display font-700 text-2xl text-text-primary mb-6">Contact Information</h2>
                <div className="space-y-5 mb-10">
                  <a href={siteConfig.phoneHref} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-brand-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Phone</p>
                      <p className="font-display font-600 text-text-primary group-hover:text-brand-blue transition-colors">{siteConfig.phone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-brand-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Email</p>
                      <p className="font-display font-600 text-text-primary group-hover:text-brand-blue transition-colors">{siteConfig.email}</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-brand-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Location</p>
                      <p className="font-display font-600 text-text-primary">{siteConfig.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-brand-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-xs text-text-muted">Hours</p>
                      <p className="font-display font-600 text-text-primary">[CLIENT TO PROVIDE: Business hours]</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-surface-alt rounded-2xl border border-slate-100">
                  <h3 className="font-display font-600 text-sm text-text-primary mb-2">Serving the Portland Metro Area</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    We serve commercial and residential properties throughout Portland, Oregon and the surrounding metro area. Contact us for specific service area coverage.
                  </p>
                </div>
              </div>
            </FadeUp>

            {/* Right: Form */}
            <FadeUp delay={0.15}>
              <div className="bg-surface-alt border border-slate-100 rounded-2xl p-7 md:p-9">
                <h2 className="font-display font-700 text-xl text-text-primary mb-6">Request a Free Assessment</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">First Name</label>
                      <input type="text" name="first_name" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" placeholder="Your first name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-muted mb-1.5">Last Name</label>
                      <input type="text" name="last_name" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" placeholder="Your last name" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Email</label>
                    <input type="email" name="email" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Phone</label>
                    <input type="tel" name="phone" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" placeholder="(503) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Property Type</label>
                    <select name="property_type" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all">
                      <option value="">Select property type</option>
                      <option value="commercial">Commercial</option>
                      <option value="residential">Residential</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Tell us about your property</label>
                    <textarea name="message" rows={4} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all resize-none" placeholder="Property address, size, services needed..." />
                  </div>
                  <input type="hidden" name="source" value="website-contact" />
                  <button type="submit" className="w-full py-3.5 bg-brand-blue text-white font-semibold rounded-xl shadow-glow hover:shadow-glow-lg hover:bg-brand-blue-dark transition-all text-sm">
                    Send Request
                  </button>
                  <p className="text-xs text-text-muted text-center">We typically respond within 24 hours.</p>
                </form>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Mini FAQ */}
      <section className="section-padding bg-surface-alt">
        <div className="container-main max-w-3xl">
          <FadeUp className="text-center mb-10">
            <h2 className="font-display font-700 text-2xl text-text-primary">Quick Questions</h2>
          </FadeUp>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-xl overflow-hidden bg-white">
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
    </>
  );
}
