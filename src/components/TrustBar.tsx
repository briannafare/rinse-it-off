"use client";

const ITEMS = [
  "Licensed & Insured",
  "Hot & Cold Water Systems",
  "Serving Portland Metro",
  "Commercial & Residential",
];

function TrustItem({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-3 whitespace-nowrap px-8">
      <span className="w-2 h-2 rounded-full bg-brand-mint/70 shrink-0" />
      <span>{label}</span>
    </span>
  );
}

export function TrustBar() {
  /* Duplicate the list so the marquee loops seamlessly */
  const doubled = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <section className="relative bg-brand-black border-t border-white/5 overflow-hidden py-5">
      <div className="flex animate-scroll-x text-white/50 text-sm md:text-base font-medium tracking-wide">
        {doubled.map((item, i) => (
          <TrustItem key={i} label={item} />
        ))}
      </div>

      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-black to-transparent pointer-events-none" />
    </section>
  );
}
