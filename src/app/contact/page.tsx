"use client";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { site } from "@/lib/data";
import { FadeIn } from "@/lib/animations";

export default function ContactPage() {
  return (
    <>
      <section className="pt-28 pb-16 bg-surface-alt"><div className="container-site text-center"><FadeIn>
        <h1 className="font-display font-800 text-display-lg text-brand-black mb-4">Get in Touch</h1>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">Whether you manage a commercial property or want your home&apos;s exterior restored &mdash; we&apos;re ready to help.</p>
      </FadeIn></div></section>

      <section className="section-gap bg-white"><div className="container-site"><div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        <FadeIn><div>
          <h2 className="font-display font-700 text-display-sm text-brand-black mb-6">Contact Information</h2>
          <div className="space-y-5 mb-10">
            <a href={site.phoneHref} className="flex items-center gap-4 group">
              <div className="w-11 h-11 bg-brand-blue/[0.06] rounded-xl flex items-center justify-center"><Phone className="w-5 h-5 text-brand-blue" /></div>
              <div><p className="text-xs text-text-muted">Phone</p><p className="font-display font-600 text-brand-black group-hover:text-brand-blue transition-colors">{site.phone}</p></div>
            </a>
            <a href={`mailto:${site.email}`} className="flex items-center gap-4 group">
              <div className="w-11 h-11 bg-brand-blue/[0.06] rounded-xl flex items-center justify-center"><Mail className="w-5 h-5 text-brand-blue" /></div>
              <div><p className="text-xs text-text-muted">Email</p><p className="font-display font-600 text-brand-black group-hover:text-brand-blue transition-colors">{site.email}</p></div>
            </a>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-brand-blue/[0.06] rounded-xl flex items-center justify-center"><MapPin className="w-5 h-5 text-brand-blue" /></div>
              <div><p className="text-xs text-text-muted">Location</p><p className="font-display font-600 text-brand-black">{site.location}</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-brand-blue/[0.06] rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-brand-blue" /></div>
              <div><p className="text-xs text-text-muted">Hours</p><p className="font-display font-600 text-brand-black">[CLIENT TO PROVIDE]</p></div>
            </div>
          </div>
          <div className="p-6 bg-surface-alt rounded-2xl border border-border-light">
            <h3 className="font-display font-600 text-sm text-brand-black mb-2">Serving the Portland Metro Area</h3>
            <p className="text-sm text-text-secondary leading-relaxed">We serve commercial and residential properties throughout Portland, Oregon and surrounding metro area.</p>
          </div>
        </div></FadeIn>

        <FadeIn delay={0.15}><div className="bg-surface-card border border-border-light rounded-3xl p-7 md:p-9">
          <h2 className="font-display font-700 text-xl text-brand-black mb-6">Request a Free Assessment</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-medium text-text-muted mb-1.5">First Name</label><input type="text" name="first_name" className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" placeholder="First name" /></div>
              <div><label className="block text-xs font-medium text-text-muted mb-1.5">Last Name</label><input type="text" name="last_name" className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" placeholder="Last name" /></div>
            </div>
            <div><label className="block text-xs font-medium text-text-muted mb-1.5">Email</label><input type="email" name="email" className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" placeholder="you@email.com" /></div>
            <div><label className="block text-xs font-medium text-text-muted mb-1.5">Phone</label><input type="tel" name="phone" className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all" placeholder="(503) 000-0000" /></div>
            <div><label className="block text-xs font-medium text-text-muted mb-1.5">Property Type</label><select name="property_type" className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all"><option value="">Select type</option><option value="commercial">Commercial</option><option value="residential">Residential</option></select></div>
            <div><label className="block text-xs font-medium text-text-muted mb-1.5">Message</label><textarea name="message" rows={4} className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm text-text-primary focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/15 transition-all resize-none" placeholder="Tell us about your property..." /></div>
            <input type="hidden" name="source" value="website-contact" />
            <button type="submit" className="btn-primary w-full justify-center">Send Request</button>
            <p className="text-xs text-text-muted text-center">We typically respond within 24 hours.</p>
          </form>
        </div></FadeIn>
      </div></div></section>
    </>
  );
}
