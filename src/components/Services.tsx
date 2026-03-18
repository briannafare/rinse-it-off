"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import { ArrowUpRight } from "lucide-react";

const SERVICES = [
  {
    title: "Building Exterior Washing",
    desc: "Multi-story soft washing and pressure washing for offices, retail, HOA, and industrial properties",
    img: IMG.breezeway,
    alt: "Freshly pressure washed commercial breezeway with stone columns in Portland Oregon",
    span: "md:col-span-2 md:row-span-2",
    tint: "group-hover:bg-brand-lavender/[0.08]",
  },
  {
    title: "Parking Lot & Surface Cleaning",
    desc: "Hot water degreasing for oil stains, gum removal, and high-traffic surfaces",
    img: IMG.parkingLot,
    alt: "Rinse It Off crew cleaning a commercial parking lot with surface cleaner and hot water rig",
    span: "",
    tint: "group-hover:bg-brand-peach/[0.10]",
  },
  {
    title: "Sidewalk & Curb Restoration",
    desc: "High-pressure concrete cleaning that strips years of grime back to original",
    img: IMG.curb,
    alt: "Freshly cleaned concrete curb and sidewalk with green grass in Portland",
    span: "",
    tint: "group-hover:bg-brand-mint/[0.06]",
  },
  {
    title: "Storefront & Entrance Cleaning",
    desc: "Keep your business entrance spotless and welcoming for customers",
    img: IMG.patio,
    alt: "Clean commercial patio entrance after pressure washing treatment",
    span: "",
    tint: "group-hover:bg-brand-pink/[0.08]",
  },
  {
    title: "HOA & Multi-Unit Properties",
    desc: "Consistent maintenance across every building, walkway, and common area",
    img: IMG.driveway,
    alt: "Clean driveway and building exterior at a property management site in Portland",
    span: "",
    tint: "group-hover:bg-brand-lime/[0.08]",
  },
  {
    title: "Recurring Maintenance Programs",
    desc: "Monthly, quarterly, and seasonal cleaning schedules that keep your property protected year-round",
    img: IMG.walkway,
    alt: "Freshly cleaned commercial walkway and landscaping at a Portland property",
    span: "md:col-span-2",
    tint: "group-hover:bg-brand-lavender/[0.06]",
  },
];

export function Services() {
  const headRef = useScrollReveal();
  const gridRef = useStaggerReveal(0.1);

  return (
    <section id="services" className="py-24 md:py-32 bg-surface-alt">
      <div className="container-site">
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="font-display font-semibold text-display-lg text-text-primary max-w-lg">
              Commercial Exterior{" "}
              <span className="font-serif font-normal italic text-brand-blue">Services</span>
            </h2>
          </div>
          <p className="text-text-secondary text-base md:text-right max-w-sm leading-relaxed">
            Pressure washing, soft washing, and hot water surface cleaning for commercial properties across Portland, Beaverton, Lake Oswego, and the Willamette Valley.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-4 gap-3 md:gap-4">
          {SERVICES.map((svc) => (
            <div key={svc.title} className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer ${svc.span} ${svc.span.includes("row-span-2") ? "min-h-[320px] md:min-h-[480px]" : "min-h-[200px] md:min-h-[240px]"}`}>
              <img
                src={svc.img}
                alt={svc.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Pastel color tint — appears on hover */}
              <div className={`absolute inset-0 transition-colors duration-700 ${svc.tint}`} />
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
