import { ArrowRight } from "lucide-react";

const FUNNELS = [
  {
    title: "My home",
    body: "Siding, roof, gutters, driveway, deck. Protect your home's costliest surfaces — get a firm quote today, not a site-visit runaround.",
    cta: "Start my quote",
    href: "/assessment",
  },
  {
    title: "My property portfolio",
    body: "Offices, HOAs, retail, multifamily. Start with a free photo-documented 21-point audit — the report that makes you look good to ownership.",
    cta: "Book a free property audit",
    href: "/assessment",
  },
];

/** Router section: two doors, straight under the hero. */
export function DualFunnel() {
  return (
    <section className="bg-[#F4F7F8] py-16 md:py-24">
      <div className="container-site grid gap-5 md:grid-cols-2 md:gap-8">
        {FUNNELS.map((f) => (
          <a
            key={f.title}
            href={f.href}
            className="group rounded-3xl border border-[#E4ECF1] bg-white p-8 transition-shadow duration-300 hover:shadow-[0_20px_50px_-20px_rgba(20,45,60,0.18)] md:p-10"
          >
            <h2
              className="text-2xl font-medium text-[#0C1215] md:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {f.title}
            </h2>
            <p className="mt-3 max-w-md text-[#4B5C6B]">{f.body}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#3AA8D4]">
              {f.cta}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
