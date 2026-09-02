import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck } from "lucide-react";

const linkClass =
  "block rounded-sm py-1 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none";

// Slugs map to the six method-matched services at /services/[slug]
// (single source of truth: src/lib/services.ts → SERVICE_SLUGS).
const residentialServices = [
  { label: "Roof Soft Wash", slug: "roof-soft-wash" },
  { label: "House & Siding Wash", slug: "house-washing" },
  { label: "Driveways & Patios", slug: "concrete-surface-cleaning" },
  { label: "Windows & Glass", slug: "pure-water-window-cleaning" },
];

const commercialServices = [
  { label: "Siding & Exterior Walls", slug: "house-washing" },
  { label: "Storefront Glass", slug: "pure-water-window-cleaning" },
  { label: "Hot-Water Degreasing", slug: "hot-water-degreasing" },
  { label: "Brick & Masonry", slug: "brick-masonry-washing" },
];

const companyLinks = [
  { label: "How It Works", href: "/#process" },
  { label: "Commercial", href: "/commercial" },
  { label: "Areas We Serve", href: "/areas" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white rounded-t-[3rem] md:rounded-t-[4rem] -mt-8 relative z-10 overflow-hidden">
      {/* Single water-blue hairline at top edge */}
      <div
        className="h-px w-full"
        style={{ background: "linear-gradient(90deg, transparent, #62C4EB 50%, transparent)", opacity: 0.4 }}
      />
      <div className="container-site pt-16 md:pt-20 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div>
            <Image
              src="/logo-white.png"
              alt="Rinse It Off"
              width={141}
              height={87}
              className="h-11 w-auto mb-5"
            />
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Residential &amp; commercial exterior cleaning across the Portland metro.
            </p>
            <div className="space-y-1.5">
              <a
                href="tel:+15037043755"
                className="flex min-h-11 items-center gap-2.5 rounded-sm py-1 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
              >
                <Phone className="w-4 h-4 text-[#62C4EB]" /> (503) 704-3755
              </a>
              <a
                href="mailto:hello@rinseitoff.com"
                className="flex min-h-11 items-center gap-2.5 rounded-sm py-1 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
              >
                <Mail className="w-4 h-4 text-[#62C4EB]" /> hello@rinseitoff.com
              </a>
              <div className="flex items-center gap-2.5 py-1 text-sm text-white/70">
                <MapPin className="w-4 h-4 text-[#62C4EB]" /> Portland, Oregon &amp; surrounding metro
              </div>
              <div className="flex items-center gap-2.5 py-1 text-sm text-white/70">
                <ShieldCheck className="w-4 h-4 text-[#62C4EB]" /> Insured
              </div>
            </div>
          </div>

          {/* Residential services */}
          <div>
            <h4 className="text-[11px] font-display font-bold uppercase tracking-wider text-white/55 mb-4">Residential</h4>
            <nav className="space-y-1">
              {residentialServices.map((s) => (
                <a key={s.label} href={`/services/${s.slug}`} className={linkClass}>
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Commercial services */}
          <div>
            <h4 className="text-[11px] font-display font-bold uppercase tracking-wider text-white/55 mb-4">Commercial</h4>
            <nav className="space-y-1">
              {commercialServices.map((s) => (
                <a key={s.label} href={`/services/${s.slug}`} className={linkClass}>
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Company + CTA */}
          <div>
            <h4 className="text-[11px] font-display font-bold uppercase tracking-wider text-white/55 mb-4">Company</h4>
            <nav className="space-y-1 mb-6">
              {companyLinks.map((l) => (
                <a key={l.label} href={l.href} className={linkClass}>
                  {l.label}
                </a>
              ))}
            </nav>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Accepting new residential &amp; commercial clients.
            </p>
            <a
              href="/assessment"
              className="group inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
            >
              Free Assessment
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-white/55">&copy; {new Date().getFullYear()} Fresh Rinse, LLC dba Rinse It Off &middot; 6465 SW Ventura Place, Tigard, OR 97223</p>
          <div className="flex items-center gap-4">
            <a
              href="/terms"
              className="rounded-sm text-[11px] text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="rounded-sm text-[11px] text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
            >
              Privacy
            </a>
            <p className="text-[11px] text-white/55">
              Built by{" "}
              <a
                href="https://eighty5labs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
              >
                eighty5labs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
