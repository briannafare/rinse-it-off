"use client";
import { Phone, Mail, MapPin } from "lucide-react";

const SERVICE_LINKS = [
  { label: "Building Washing", href: "#services" },
  { label: "Parking Lots", href: "#services" },
  { label: "Storefronts", href: "#services" },
  { label: "HOA & Multi-Unit", href: "#services" },
  { label: "Window Cleaning", href: "#services" },
  { label: "Recurring Maintenance", href: "#services" },
];

const COMPANY_LINKS = [
  { label: "How It Works", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-dark-section text-white relative overflow-hidden">
      {/* Wave top */}
      <div className="absolute top-0 left-0 right-0 rotate-180">
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="w-full h-[50px] md:h-[72px]" fill="none">
          <path fill="#FFFFFF" d="M0,56 C180,20 360,72 540,48 C720,24 900,64 1080,44 C1260,24 1380,56 1440,40 L1440,72 L0,72 Z" />
        </svg>
      </div>

      <div className="container-site pt-24 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <img src="/logo-white.png" alt="Rinse It Off" className="h-12 w-auto mb-5" />
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Portland&apos;s commercial exterior cleaning experts. Building washing, parking structures, and recurring maintenance programs.
            </p>
            <div className="space-y-3">
              <a href="tel:+15037043755" className="flex items-center gap-3 text-sm text-white/70 hover:text-brand-blue transition-colors">
                <Phone className="w-4 h-4 text-brand-blue/60" />
                (503) 704-3755
              </a>
              <a href="mailto:hello@rinseitoff.com" className="flex items-center gap-3 text-sm text-white/70 hover:text-brand-blue transition-colors">
                <Mail className="w-4 h-4 text-brand-blue/60" />
                hello@rinseitoff.com
              </a>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-brand-blue/60" />
                Portland, Oregon
              </div>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white/40 mb-4">Services</h4>
            <nav className="space-y-2.5">
              {SERVICE_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="block text-sm text-white/60 hover:text-brand-blue transition-colors duration-300">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Company column */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white/40 mb-4">Company</h4>
            <nav className="space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="block text-sm text-white/60 hover:text-brand-blue transition-colors duration-300">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* CTA column */}
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white/40 mb-4">Get Started</h4>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              Ready for a cleaner property? Book a free assessment — no commitment required.
            </p>
            <a href="#contact" className="btn-primary text-sm w-full justify-center">
              Free Assessment
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Rinse It Off. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built by <a href="https://eighty5labs.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-brand-blue transition-colors">eighty5labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
