import Link from "next/link";
import Image from "next/image";
import { siteConfig, residentialLinks } from "@/lib/data";
import { Phone, Mail, MapPin } from "lucide-react";

const commercialLinks = [
  { label: "Building Washing", href: "/commercial-services" },
  { label: "Parking Lots", href: "/commercial-services" },
  { label: "Storefront Cleaning", href: "/commercial-services" },
  { label: "HOA Maintenance", href: "/commercial-services" },
  { label: "Commercial Windows", href: "/commercial-services" },
  { label: "Recurring Programs", href: "/commercial-services" },
];

export function FooterFull() {
  return (
    <footer className="bg-brand-dark text-white/70">
      <div className="container-main py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <Image src="/icon.png" alt="Rinse It Off" width={32} height={32} />
              <span className="font-display font-800 text-lg text-white tracking-tight">
                Rinse It Off
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Portland&apos;s commercial exterior cleaning specialists. One vendor. Every
              surface. Year-round.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a href={siteConfig.phoneHref} className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                <Phone className="w-4 h-4 text-brand-blue" /> {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                <Mail className="w-4 h-4 text-brand-blue" /> {siteConfig.email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-blue" /> {siteConfig.location}
              </span>
            </div>
          </div>

          {/* Commercial */}
          <div>
            <h4 className="font-display font-700 text-white text-sm mb-4">
              Commercial Services
            </h4>
            <ul className="space-y-2.5">
              {commercialLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm hover:text-brand-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Residential */}
          <div>
            <h4 className="font-display font-700 text-white text-sm mb-4">
              Residential Services
            </h4>
            <ul className="space-y-2.5">
              {residentialLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-brand-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-700 text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm hover:text-brand-blue transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-brand-blue transition-colors">Contact</Link></li>
              <li><Link href="/commercial-services" className="text-sm hover:text-brand-blue transition-colors">Get a Free Assessment</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>&copy; {new Date().getFullYear()} Rinse It Off. All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
