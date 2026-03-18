"use client";

const SERVICES = [
  "Building Washing",
  "Parking Structures",
  "Storefronts",
  "Sidewalks & Curbs",
  "HOA & Multi-Unit",
  "Window Cleaning",
  "Roof & Gutter",
  "Concrete & Decks",
  "Recurring Maintenance",
  "Hot & Cold Water",
  "Soft Washing",
  "House Washing",
];

export function ServiceTicker() {
  const items = [...SERVICES, ...SERVICES];

  return (
    <section className="relative py-6 bg-white overflow-hidden border-y border-border-light">
      <div className="flex animate-scroll-x whitespace-nowrap">
        {items.map((service, i) => (
          <span key={i} className="flex items-center gap-4 px-4 text-sm md:text-base font-display font-semibold text-text-muted/60 uppercase tracking-wide">
            {service}
            <svg className="w-2 h-2 text-brand-blue/40 flex-shrink-0" viewBox="0 0 8 8" fill="currentColor">
              <circle cx="4" cy="4" r="4" />
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
