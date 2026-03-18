import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

const SERVICE_LINKS = [
  "Building Washing", "Parking Lots", "Storefronts",
  "HOA & Multi-Unit", "Window Cleaning", "Recurring Maintenance",
];

const COMPANY_LINKS = [
  { label: "How It Works", href: "#process" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white relative overflow-hidden">
      {/* Subtle top border with mint */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-mint/30 to-transparent" />

      <div className="container-site pt-16 md:pt-20 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src="/logo-white.png" alt="Rinse It Off" className="h-12 w-auto mb-5" />
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Portland&apos;s commercial exterior cleaning experts. Building washing, parking structures, and recurring maintenance.
            </p>
            <div className="space-y-2.5">
              <a href="tel:+15037043755" className="flex items-center gap-3 text-sm text-white/60 hover:text-brand-mint transition-colors">
                <Phone className="w-3.5 h-3.5 text-brand-mint/50" /> (503) 704-3755
              </a>
              <a href="mailto:hello@rinseitoff.com" className="flex items-center gap-3 text-sm text-white/60 hover:text-brand-mint transition-colors">
                <Mail className="w-3.5 h-3.5 text-brand-mint/50" /> hello@rinseitoff.com
              </a>
              <div className="flex items-center gap-3 text-sm text-white/40">
                <MapPin className="w-3.5 h-3.5 text-brand-mint/50" /> Portland, Oregon
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white/30 mb-4">Services</h4>
            <nav className="space-y-2">
              {SERVICE_LINKS.map((label) => (
                <a key={label} href="#services" className="block text-sm text-white/50 hover:text-brand-mint transition-colors duration-300">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white/30 mb-4">Company</h4>
            <nav className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <a key={link.label} href={link.href} className="block text-sm text-white/50 hover:text-brand-mint transition-colors duration-300">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* CTA */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white/30 mb-4">Get Started</h4>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              Book a free property assessment. No commitment required.
            </p>
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-mint text-brand-black text-sm font-bold rounded-full hover:brightness-110 transition-all duration-300">
              Free Assessment
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} Rinse It Off. All rights reserved.
          </p>
          <p className="text-xs text-white/15">
            Built by <a href="https://eighty5labs.com" target="_blank" rel="noopener noreferrer" className="text-white/25 hover:text-brand-mint transition-colors">eighty5labs</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
