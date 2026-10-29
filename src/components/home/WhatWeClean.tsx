/** Block 3: what we clean, commercial first, each item linking to its page. */
const BUSINESS = [
  { label: "Building fronts", href: "/commercial" },
  { label: "Parking lots", href: "/services/concrete-surface-cleaning" },
  { label: "Entrances", href: "/commercial" },
  { label: "Trash pads", href: "/services/hot-water-degreasing" },
];
const HOME = [
  { label: "Roofs", href: "/services/roof-soft-wash" },
  { label: "Siding", href: "/services/house-washing" },
  { label: "Gutters", href: "/services/gutter-cleaning" },
  { label: "Driveways", href: "/services/concrete-surface-cleaning" },
  { label: "Windows", href: "/services/pure-water-window-cleaning" },
];

function List({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="label-caps !tracking-[0.14em] text-[#1A6E93]">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((i) => (
          <li key={i.label}>
            <a
              href={i.href}
              className="inline-flex min-h-11 items-center rounded-[10px] border-2 border-[#0C1215] bg-white px-4 text-base font-semibold text-[#0C1215] transition-colors hover:bg-[#F2B632] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] motion-reduce:transition-none"
            >
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function WhatWeClean() {
  return (
    <section id="what-we-clean" className="bg-retro-paper py-14 md:py-20">
      <div className="container-site">
        <h2 className="text-3xl font-medium text-[#0C1215] md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
          What we clean
        </h2>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#3B4247]">
          A greasy trash pad and a mossy roof want opposite things. So we look first, then decide how
          much pressure, heat or soap each one gets.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <List title="For businesses" items={BUSINESS} />
          <List title="For homes" items={HOME} />
        </div>
      </div>
    </section>
  );
}
