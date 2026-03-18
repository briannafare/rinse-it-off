"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
  { title: "Building Washing", desc: "Multi-story exterior cleaning for offices, retail, and industrial", img: IMG.architecture, span: "md:col-span-2 md:row-span-2" },
  { title: "Parking Lots", desc: "Hot water degreasing for oil stains and high-traffic areas", img: IMG.concrete, span: "" },
  { title: "Storefronts", desc: "Keep your entrance spotless and inviting", img: IMG.storefront, span: "" },
  { title: "HOA & Multi-Unit", desc: "Consistent maintenance across the community", img: IMG.property, span: "" },
  { title: "Window Cleaning", desc: "Streak-free glass with RO water purification", img: IMG.glass, span: "" },
  { title: "Recurring Maintenance", desc: "Monthly, quarterly, or seasonal programs", img: IMG.office, span: "md:col-span-2" },
];

export function Services() {
  const headRef = useScrollReveal();
  const gridRef = useStaggerReveal(0.1);

  return (
    <section id="services" className="py-24 md:py-32 bg-surface-alt">
      <div className="container-site">
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <h2 className="font-display font-extrabold text-display-lg text-text-primary max-w-lg leading-tight">
            Commercial Exterior <span className="font-serif font-normal italic text-brand-blue">Services</span>
          </h2>
          <p className="text-text-secondary text-base md:text-right max-w-sm leading-relaxed">
            From single storefronts to multi-building complexes across Portland metro.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-4 gap-3 md:gap-4">
          {SERVICES.map((svc) => (
            <div key={svc.title} className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer ${svc.span} ${svc.span.includes("row-span-2") ? "min-h-[320px] md:min-h-[480px]" : "min-h-[200px] md:min-h-[240px]"}`}>
              <img
                src={svc.img}
                alt={svc.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-6">
                <div className="flex justify-end">
                  <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-brand-mint group-hover:border-brand-mint group-hover:text-brand-black transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-lg md:text-xl mb-1">{svc.title}</h3>
                  <p className="text-white/50 text-sm">{svc.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
