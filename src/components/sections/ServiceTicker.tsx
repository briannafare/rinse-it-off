"use client";

const SERVICES = [
  "Building Washing", "Parking Structures", "Storefronts",
  "Sidewalks & Curbs", "HOA & Multi-Unit", "Window Cleaning",
  "Roof & Gutter", "Concrete & Decks", "Recurring Maintenance",
  "Hot & Cold Water", "Soft Washing", "House Washing",
];

export function ServiceTicker() {
  const items = [...SERVICES, ...SERVICES];

  return (
    <section className="relative py-5 bg-surface-alt overflow-hidden border-y border-border-light">
      <div className="flex animate-scroll-x whitespace-nowrap">
        {items.map((service, i) => (
          <span key={i} className="flex items-center gap-4 px-5 text-sm font-display font-semibold text-text-muted/50 uppercase tracking-wide">
            {service}
            <span className="w-1.5 h-1.5 rounded-full bg-brand-mint/40 flex-shrink-0" />
          </span>
        ))}
      </div>
    </section>
  );
}
