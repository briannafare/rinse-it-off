"use client";
import Image from "next/image";
import { useStaggerReveal, useScrollReveal } from "@/lib/gsap";

const SERVICES = [
  {
    icon: "/brand/icons/house-wash.png",
    title: "House Wash",
    method: "Soft wash",
    body: "Low pressure, targeted detergents. Algae and mildew die at the root — your siding keeps its finish.",
  },
  {
    icon: "/brand/icons/roof-cleaning.png",
    title: "Roof Cleaning & Moss",
    method: "No-pressure treatment",
    body: "Moss killed and lifted without blasting granules off your shingles. The warranty-safe way.",
  },
  {
    icon: "/brand/icons/gutter-cleaning.png",
    title: "Gutter Cleaning",
    method: "Hand-clear + flow test",
    body: "Cleared, flushed, flow-tested, debris hauled away. Overflow never reaches your foundation.",
  },
  {
    icon: "/brand/icons/concrete-deck.png",
    title: "Driveway & Concrete",
    method: "Hot water, 180°F",
    body: "Rotary surface cleaner, even passes, no zebra stripes. The machine in our photos — that's this.",
  },
  {
    icon: "/brand/icons/soft-wash.png",
    title: "Deck & Fence Restoration",
    method: "Soft wash + brightener",
    body: "Gray cedar comes back. Washed, brightened, pH-neutralized — ready for stain the same week.",
  },
  {
    icon: "/brand/icons/gutter-guard.png",
    title: "Window Washing",
    method: "Hand-finished",
    body: "Inside and out, screens and tracks included. Spot-checked against the light before we leave.",
  },
];

export function ServicesGrid() {
  const headRef = useScrollReveal();
  const gridRef = useStaggerReveal(0.08);

  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div className="container-site">
        <div ref={headRef} className="flex flex-wrap items-end justify-between gap-6">
          <h2
            className="max-w-xl text-3xl font-medium text-[#0C1215] md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Six services. One rule: the method matches the surface.
          </h2>
          <p className="max-w-sm text-[#4B5C6B]">
            Pressure is a tool, not a default. Every card tells you exactly how
            we&apos;ll clean it.
          </p>
        </div>

        <div ref={gridRef} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-[#E4ECF1] bg-[#FAFCFD] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(20,45,60,0.22)]"
            >
              {/* hairline turns water-blue on hover */}
              <span className="absolute inset-x-0 top-0 h-[2px] bg-transparent transition-colors duration-300 group-hover:bg-[#62C4EB]" />
              <div className="flex items-start justify-between">
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF7FC] transition-transform duration-300 group-hover:scale-105">
                  <Image src={s.icon} alt="" width={40} height={40} className="h-10 w-10" />
                </span>
                <span className="rounded-lg bg-[#EDF7FC] px-2.5 py-1 text-xs font-semibold text-[#3AA8D4]">
                  {s.method}
                </span>
              </div>
              <h3
                className="mt-5 text-lg font-medium text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
