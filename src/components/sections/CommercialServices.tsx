"use client";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/Reveal";

const COMMERCIAL_SERVICES = [
  {
    title: "Building Washing",
    desc: "Multi-story exterior cleaning for offices, retail, and industrial buildings. We handle every surface type safely.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="16" width="32" height="26" rx="2" stroke="#62C4EB" strokeWidth="2" />
        <rect x="14" y="22" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
        <rect x="28" y="22" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
        <rect x="14" y="32" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
        <rect x="28" y="32" width="6" height="6" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
        <path d="M24 16V8L18 12" stroke="#62C4EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Parking Lots & Trash Pads",
    desc: "Hot water cleaning for oil stains, grease traps, and high-traffic parking areas. Restore and maintain.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="28" width="36" height="14" rx="2" stroke="#62C4EB" strokeWidth="2" />
        <path d="M12 28V22H36V28" stroke="#62C4EB" strokeWidth="2" strokeLinecap="round" />
        <circle cx="16" cy="35" r="3" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
        <circle cx="32" cy="35" r="3" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
        <path d="M20 18L24 6L28 18" stroke="#62C4EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Sidewalks & Curbs",
    desc: "High-pressure surface cleaning that removes gum, stains, and years of grime from concrete and stone.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M6 38H42" stroke="#62C4EB" strokeWidth="2" strokeLinecap="round" />
        <rect x="10" y="26" width="8" height="12" rx="1" fill="#62C4EB" fillOpacity="0.10" stroke="#62C4EB" strokeWidth="1.5" />
        <rect x="20" y="26" width="8" height="12" rx="1" fill="#62C4EB" fillOpacity="0.10" stroke="#62C4EB" strokeWidth="1.5" />
        <rect x="30" y="26" width="8" height="12" rx="1" fill="#62C4EB" fillOpacity="0.10" stroke="#62C4EB" strokeWidth="1.5" />
        <path d="M38 20C38 20 34 10 28 14C22 18 18 8 14 12" stroke="#62C4EB" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
      </svg>
    ),
  },
  {
    title: "Storefronts",
    desc: "Keep your business entrance spotless and inviting. First impressions happen at the front door.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 18L24 8L40 18" stroke="#62C4EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="10" y="18" width="28" height="24" rx="1" stroke="#62C4EB" strokeWidth="2" />
        <rect x="18" y="28" width="12" height="14" rx="1" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
        <path d="M14 22H20M28 22H34" stroke="#62C4EB" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    title: "HOA & Multi-Unit",
    desc: "Apartment complexes, condos, townhomes. Consistent maintenance across every building in the community.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="4" y="20" width="16" height="22" rx="1" stroke="#62C4EB" strokeWidth="2" />
        <rect x="28" y="14" width="16" height="28" rx="1" stroke="#62C4EB" strokeWidth="2" />
        <rect x="8" y="24" width="4" height="4" rx="0.5" fill="#62C4EB" fillOpacity="0.15" />
        <rect x="8" y="32" width="4" height="4" rx="0.5" fill="#62C4EB" fillOpacity="0.15" />
        <rect x="32" y="18" width="4" height="4" rx="0.5" fill="#62C4EB" fillOpacity="0.15" />
        <rect x="32" y="26" width="4" height="4" rx="0.5" fill="#62C4EB" fillOpacity="0.15" />
        <rect x="32" y="34" width="4" height="4" rx="0.5" fill="#62C4EB" fillOpacity="0.15" />
        <path d="M20 36H28" stroke="#62C4EB" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    title: "Window Cleaning",
    desc: "Reverse osmosis water purification for streak-free, spot-free glass. Interior and exterior.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="10" y="8" width="28" height="32" rx="2" stroke="#62C4EB" strokeWidth="2" />
        <line x1="24" y1="8" x2="24" y2="40" stroke="#62C4EB" strokeWidth="1.5" strokeOpacity="0.3" />
        <line x1="10" y1="24" x2="38" y2="24" stroke="#62C4EB" strokeWidth="1.5" strokeOpacity="0.3" />
        <path d="M15 14L18 18" stroke="#62C4EB" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
        <circle cx="33" cy="14" r="4" fill="#62C4EB" fillOpacity="0.10" stroke="#62C4EB" strokeWidth="1" strokeOpacity="0.3" />
      </svg>
    ),
  },
  {
    title: "Recurring Maintenance",
    desc: "Monthly, quarterly, or seasonal programs tailored to your property. Set it and forget it.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="16" stroke="#62C4EB" strokeWidth="2" />
        <path d="M24 14V24L30 28" stroke="#62C4EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M38 12L42 8M10 36L6 40" stroke="#62C4EB" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
        <circle cx="24" cy="24" r="2" fill="#62C4EB" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    title: "Soft Washing",
    desc: "Low-pressure chemical treatment for delicate surfaces — stucco, wood siding, painted finishes, and more.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M12 36C12 36 14 24 20 20C26 16 30 24 36 20" stroke="#62C4EB" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 40C8 40 16 32 24 32C32 32 40 40 40 40" stroke="#62C4EB" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
        <circle cx="20" cy="12" r="3" fill="#62C4EB" fillOpacity="0.15" stroke="#62C4EB" strokeWidth="1.5" />
        <circle cx="34" cy="14" r="2" fill="#62C4EB" fillOpacity="0.10" stroke="#62C4EB" strokeWidth="1" />
      </svg>
    ),
  },
];

export function CommercialServices() {
  return (
    <section id="services" className="section-gap bg-white relative">
      <div className="container-site">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="overline mb-3 block">What We Do</span>
          <h2 className="font-display font-extrabold text-display-lg text-text-primary mb-4">
            Commercial Exterior Cleaning
          </h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            From single storefronts to multi-building complexes, we keep Portland&apos;s commercial properties clean, safe, and looking sharp.
          </p>
        </Reveal>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {COMMERCIAL_SERVICES.map((svc) => (
            <StaggerItem key={svc.title}>
              <div className="group relative bg-surface-card rounded-2xl p-6 border border-border-light hover-lift cursor-default h-full">
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-blue/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="mb-4 w-14 h-14 rounded-xl bg-surface-blue flex items-center justify-center group-hover:bg-brand-blue/10 transition-colors duration-300">
                    {svc.icon}
                  </div>
                  <h3 className="font-display font-bold text-base text-text-primary mb-2 group-hover:text-brand-blue-dark transition-colors duration-300">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
