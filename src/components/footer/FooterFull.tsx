import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { site, residentialLinks } from "@/lib/data";

const commercialLinks = [
  { label: "Building Washing", href: "/commercial-services" },
  { label: "Parking Lots", href: "/commercial-services" },
  { label: "Storefront Cleaning", href: "/commercial-services" },
  { label: "HOA Maintenance", href: "/commercial-services" },
  { label: "Window Cleaning", href: "/commercial-services" },
  { label: "Recurring Programs", href: "/commercial-services" },
];

export function FooterFull() {
  return (
    <footer className="bg-brand-dark text-white/60 relative overflow-hidden">
      {/* Subtle decorative orb */}
      <div className="absolute top-0 right-[15%] w-64 h-64 bg-brand-blue/[0.04] rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="container-site py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-5">
              <img src="/logo-white.png" alt="Rinse It Off" className="h-12 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Portland&apos;s full-service commercial exterior cleaning company. One vendor. Every surface. Year-round.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href={site.phoneHref} className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                <Phone className="w-4 h-4 text-brand-blue/60" /> {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                <Mail className="w-4 h-4 text-brand-blue/60" /> {site.email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-blue/60" /> {site.location}
              </span>
            </div>
          </div>

          {/* Commercial */}
          <div>
            <h4 className="font-display font-700 text-white text-sm mb-4">Commercial</h4>
            <ul className="space-y-2">
              {commercialLinks.map((l) => (
                <li key={l.label}><Link href={l.href} className="text-sm hover:text-brand-blue transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Residential */}
          <div>
            <h4 className="font-display font-700 text-white text-sm mb-4">Residential</h4>
            <ul className="space-y-2">
              {residentialLinks.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-sm hover:text-brand-blue transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-700 text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm hover:text-brand-blue transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-brand-blue transition-colors">Contact</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-brand-blue transition-colors">Free Assessment</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <span>&copy; {new Date().getFullYear()} Rinse It Off. All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/50 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
