import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { AI_PAGES, visibleHere } from "@/lib/ai-pages";

const linkClass =
  "block rounded-sm py-1 text-sm text-[#0C1215]/70 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none";

// Slugs map to the six method-matched services at /services/[slug]
// (single source of truth: src/lib/services.ts → SERVICE_SLUGS).
const residentialServices = [
  { label: "Roof Soft Wash", slug: "roof-soft-wash" },
  { label: "Gutter Cleaning", slug: "gutter-cleaning" },
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
  { label: "Yearly Plan", href: "/plan" },
  { label: "Holiday Lights", href: "/holiday-lights" },
  { label: "About Us", href: "/about" },
  { label: "How It Works", href: "/#process" },
  { label: "Commercial", href: "/commercial" },
  { label: "Areas We Serve", href: "/areas" },
  { label: "FAQ", href: "/#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// The answer pages, linked from every page so none is an orphan. Short labels;
// a page drops out here whenever it is held back from production.
const GUIDE_LABELS: Record<string, string> = {
  "/blog/house-washing-cost-portland": "House washing cost",
  "/blog/how-often-wash-a-portland-house": "How often to wash a house",
  "/blog/soft-wash-vs-pressure-wash": "Soft wash vs pressure wash",
  "/blog/roof-moss-removal-cost-and-method": "Roof moss removal",
  "/compare/subscription-vs-one-off-pressure-washing": "Yearly plan vs one-off",
  "/compare/rinse-it-off-vs-diy-rented-pressure-washer": "Renting a pressure washer",
  "/commercial/hiring-a-pressure-washing-company": "Hiring a contractor (HOAs)",
};
const guideLinks = AI_PAGES.filter((p) => GUIDE_LABELS[p.path] && visibleHere(p)).map((p) => ({
  label: GUIDE_LABELS[p.path],
  href: p.path,
}));

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden bg-[#62C4EB] pb-16 text-[#0C1215] md:pb-0">
      <div className="container-site pt-16 md:pt-20 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div>
            <Image
              src="/logo-dark.png"
              alt="Rinse It Off"
              width={141}
              height={87}
              className="h-11 w-auto mb-5"
            />
            <p className="text-[#0C1215]/70 text-sm leading-relaxed mb-6">
              Residential &amp; commercial exterior cleaning across the Portland metro.
            </p>
            <div className="space-y-1.5">
              <a
                href="tel:+19716264146"
                className="flex min-h-11 items-center gap-2.5 rounded-sm py-1 text-sm text-[#0C1215]/70 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
              >
                <Phone className="w-4 h-4 text-[#0C1215]" /> (971) 626-4146
              </a>
              <a
                href="mailto:hello@rinseitoff.com"
                className="flex min-h-11 items-center gap-2.5 rounded-sm py-1 text-sm text-[#0C1215]/70 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
              >
                <Mail className="w-4 h-4 text-[#0C1215]" /> hello@rinseitoff.com
              </a>
              <div className="flex items-center gap-2.5 py-1 text-sm text-[#0C1215]/70">
                <MapPin className="w-4 h-4 text-[#0C1215]" /> Portland, Oregon &amp; surrounding metro
              </div>
              <div className="flex items-center gap-2.5 py-1 text-sm text-[#0C1215]/70">
                <ShieldCheck className="w-4 h-4 text-[#0C1215]" /> Insured
              </div>
            </div>
          </div>

          {/* Residential services */}
          <div>
            <p className="label-caps mb-4 text-[#0C1215]">Residential</p>
            <nav aria-label="Residential services" className="space-y-1">
              {residentialServices.map((s) => (
                <a key={s.label} href={`/services/${s.slug}`} className={linkClass}>
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Commercial services */}
          <div>
            <p className="label-caps mb-4 text-[#0C1215]">Commercial</p>
            <nav aria-label="Commercial services" className="space-y-1">
              {commercialServices.map((s) => (
                <a key={s.label} href={`/services/${s.slug}`} className={linkClass}>
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Answers */}
          <div>
            <p className="label-caps mb-4 text-[#0C1215]">Answers</p>
            <nav aria-label="Answers" className="space-y-1">
              {guideLinks.map((l) => (
                <a key={l.href} href={l.href} className={linkClass}>
                  {l.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Company + CTA */}
          <div>
            <p className="label-caps mb-4 text-[#0C1215]">Company</p>
            <nav aria-label="Company" className="space-y-1 mb-6">
              {companyLinks.map((l) => (
                <a key={l.label} href={l.href} className={linkClass}>
                  {l.label}
                </a>
              ))}
            </nav>
            <p className="text-sm text-[#0C1215]/70 leading-relaxed mb-4">
              Accepting new residential &amp; commercial clients.
            </p>
            <a
              href="/assessment"
              className="group inline-flex min-h-11 items-center gap-2 rounded-[14px] btn-print bg-[#F2B632] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
            >
              Free Walkthrough
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#0C1215]/15 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="flex items-center gap-3 text-sm text-[#0C1215]/65">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/hal/hal-mark-outline.svg" alt="" aria-hidden width={40} height={40} className="h-9 w-9" />&copy; {new Date().getFullYear()} Fresh Rinse, LLC dba Rinse It Off &middot; Tigard, Oregon</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61594392927890"
              target="_blank"
              rel="noopener"
              className="rounded-sm text-sm text-[#0C1215]/65 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]"
            >
              Facebook
            </a>
            <a
              href="/terms"
              className="rounded-sm text-sm text-[#0C1215]/65 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="rounded-sm text-sm text-[#0C1215]/65 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
            >
              Privacy
            </a>
            <p className="text-sm text-[#0C1215]/65">
              Built by{" "}
              <a
                href="https://eighty5labs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-[#0C1215]/70 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark motion-reduce:transition-none"
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
