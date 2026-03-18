"use client";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/Reveal";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    title: "Building Washing",
    desc: "Multi-story exterior cleaning for offices, retail, and industrial",
    tags: ["commercial", "soft wash"],
    gradient: "from-[#1a3040] via-[#2a4858] to-[#1a2e3d]",
    size: "lg",
  },
  {
    title: "Parking Lots & Trash Pads",
    desc: "Hot water degreasing for oil stains and high-traffic areas",
    tags: ["hot water", "degreasing"],
    gradient: "from-[#2d3a28] via-[#3d4a38] to-[#2a3525]",
    size: "sm",
  },
  {
    title: "Storefronts",
    desc: "Keep your entrance spotless and inviting for every customer",
    tags: ["retail", "recurring"],
    gradient: "from-[#3a2d28] via-[#4a3d38] to-[#352a25]",
    size: "sm",
  },
  {
    title: "Sidewalks & Curbs",
    desc: "High-pressure surface cleaning removes gum, stains, and years of grime",
    tags: ["concrete", "high pressure"],
    gradient: "from-[#28303a] via-[#384050] to-[#252d38]",
    size: "sm",
  },
  {
    title: "HOA & Multi-Unit",
    desc: "Consistent maintenance across every building in the community",
    tags: ["apartment", "community"],
    gradient: "from-[#2a2d3a] via-[#3a3d4a] to-[#252838]",
    size: "sm",
  },
  {
    title: "Window Cleaning",
    desc: "Streak-free glass with reverse osmosis water purification",
    tags: ["RO water", "interior/exterior"],
    gradient: "from-[#1a2840] via-[#2a3858] to-[#1a253d]",
    size: "md",
  },
  {
    title: "Recurring Maintenance",
    desc: "Monthly, quarterly, or seasonal programs tailored to your property",
    tags: ["scheduled", "programs"],
    gradient: "from-[#283a2d] via-[#384a3d] to-[#253828]",
    size: "md",
  },
];

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const isLarge = service.size === "lg";

  return (
    <div className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${service.gradient} border border-white/5 cursor-pointer transition-all duration-500 hover:shadow-soft-lg hover:scale-[1.01] ${isLarge ? "md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[360px]" : "min-h-[200px] md:min-h-[240px]"}`}>
      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-brand-mint/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-5 md:p-6">
        {/* Top: tags + arrow */}
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            {service.tags.map((tag) => (
              <span key={tag} className="pill bg-white/8 border-white/10 text-white/60 text-[10px]">{tag}</span>
            ))}
          </div>
          <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-brand-mint group-hover:border-brand-mint group-hover:text-brand-black transition-all duration-300">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Bottom: title + desc */}
        <div>
          <h3 className={`font-display font-bold text-white mb-1.5 group-hover:text-brand-mint transition-colors duration-300 ${isLarge ? "text-2xl md:text-3xl" : "text-lg"}`}>
            {service.title}
          </h3>
          <p className={`text-white/50 leading-relaxed ${isLarge ? "text-sm max-w-md" : "text-xs"}`}>
            {service.desc}
          </p>
        </div>
      </div>

      {/* Photo placeholder indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.06] pointer-events-none">
        <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="8" y="16" width="48" height="32" rx="4" />
          <circle cx="44" cy="28" r="4" />
          <path d="M8 40L24 30L36 38L48 26L56 34" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function CommercialServices() {
  return (
    <section id="services" className="section-gap bg-white relative">
      <div className="container-site">
        {/* Section header — editorial style */}
        <div className="grid md:grid-cols-2 gap-6 mb-12 md:mb-16 items-end">
          <Reveal>
            <span className="overline mb-3 block">What We Do</span>
            <h2 className="font-display font-extrabold text-display-lg text-text-primary">
              Commercial Exterior
              <br />
              <span className="font-serif font-normal italic text-brand-blue">Cleaning</span> Services
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-text-secondary text-lg leading-relaxed md:text-right">
              From single storefronts to multi-building complexes — we keep Portland&apos;s commercial properties clean, safe, and sharp.
            </p>
          </Reveal>
        </div>

        {/* Service card grid — bento style */}
        <StaggerContainer className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {SERVICES.map((service, i) => (
            <StaggerItem key={service.title}>
              <ServiceCard service={service} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
