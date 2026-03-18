"use client";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

const PROBLEMS = [
  { problem: "Moss & algae growth", surface: "North-facing walls, roofs, concrete", frequency: "Year-round", severity: "high" },
  { problem: "Oil & grease stains", surface: "Parking lots, drive-throughs", frequency: "Ongoing", severity: "high" },
  { problem: "Atmospheric grime", surface: "All exterior surfaces", frequency: "Seasonal", severity: "medium" },
  { problem: "Gum & organic buildup", surface: "Sidewalks, entryways", frequency: "Daily", severity: "medium" },
  { problem: "Hard water deposits", surface: "Windows, glass facades", frequency: "After rain", severity: "low" },
  { problem: "Mildew & black streaks", surface: "Gutters, trim, siding", frequency: "Spring/Fall", severity: "high" },
];

export function WhyClean() {
  return (
    <section className="relative py-24 md:py-32 bg-brand-dark text-white overflow-hidden">
      <div className="container-site relative z-10">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-8 mb-14 items-end">
          <Reveal>
            <span className="text-brand-mint text-[11px] font-bold tracking-[0.1em] uppercase font-display mb-3 block">The Portland Problem</span>
            <h2 className="font-display font-extrabold text-display-lg text-white">
              164 Days of Rain.
              <br />
              <span className="font-serif font-normal italic text-brand-mint">Your Building Feels Every One.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-white/50 text-lg leading-relaxed">
              Nine months of drizzle means every commercial property in Portland is fighting moss, algae, and atmospheric grime. Regular cleaning isn&apos;t cosmetic — it&apos;s protection.
            </p>
          </Reveal>
        </div>

        {/* Table-style problem list */}
        <Reveal>
          <div className="rounded-3xl border border-white/[0.06] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 md:px-8 py-4 border-b border-white/[0.06] text-xs font-display uppercase tracking-wider text-white/30">
              <div className="col-span-4 md:col-span-4">Problem</div>
              <div className="col-span-4 md:col-span-4 hidden md:block">Surfaces Affected</div>
              <div className="col-span-4 md:col-span-2">Frequency</div>
              <div className="col-span-4 md:col-span-2 text-right">Severity</div>
            </div>

            {/* Rows */}
            {PROBLEMS.map((item, i) => (
              <div key={item.problem} className="grid grid-cols-12 gap-4 px-5 md:px-8 py-5 border-b border-white/[0.04] last:border-b-0 group hover:bg-white/[0.02] transition-colors">
                <div className="col-span-8 md:col-span-4">
                  <p className="font-display font-semibold text-white text-sm group-hover:text-brand-mint transition-colors">{item.problem}</p>
                  <p className="text-white/30 text-xs mt-0.5 md:hidden">{item.surface}</p>
                </div>
                <div className="col-span-4 hidden md:flex items-center">
                  <p className="text-white/40 text-sm">{item.surface}</p>
                </div>
                <div className="hidden md:flex col-span-2 items-center">
                  <span className="pill-outline border-white/10 text-white/50">{item.frequency}</span>
                </div>
                <div className="col-span-4 md:col-span-2 flex items-center justify-end">
                  <span className={`w-2 h-2 rounded-full ${item.severity === "high" ? "bg-brand-mint" : item.severity === "medium" ? "bg-brand-blue" : "bg-white/30"}`} />
                  <span className="text-xs text-white/40 ml-2 capitalize">{item.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Bottom CTA */}
        <Reveal className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm max-w-md">
            Regular exterior maintenance extends surface life, prevents costly repairs, and shows tenants and customers you care about your property.
          </p>
          <a href="#contact" className="btn-mint group flex-shrink-0">
            Get a Free Assessment
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
