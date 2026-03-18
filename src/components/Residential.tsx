"use client";
import { useScrollReveal, useStaggerReveal } from "@/lib/gsap";
import { IMG } from "@/lib/images";
import { ArrowUpRight } from "lucide-react";

const RESIDENTIAL = [
  { title: "House Washing", desc: "Gentle soft washing — removes buildup without damaging siding, trim, or paint.", img: IMG.houseWash },
  { title: "Roof & Gutter Cleaning", desc: "Moss removal, gutter clearing, preventive treatments that protect your roof.", img: IMG.roof },
  { title: "Concrete Cleaning", desc: "Driveways, patios, walkways — hot water pressure washing restores the original surface.", img: IMG.concrete },
  { title: "Deck & Fence", desc: "Wood-safe cleaning that revitalizes outdoor spaces without stripping or damage.", img: IMG.house },
  { title: "Window Washing", desc: "Crystal-clear, streak-free glass with reverse osmosis water purification.", img: IMG.glass },
];

export function Residential() {
  const headRef = useScrollReveal();
  const listRef = useStaggerReveal(0.08);

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container-site">
        <div ref={headRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <h2 className="font-display font-extrabold text-display-lg text-text-primary max-w-md leading-tight">
            Residential <span className="font-serif font-normal italic text-brand-blue">Cleaning</span>
          </h2>
          <p className="text-text-secondary text-base max-w-sm md:text-right leading-relaxed">
            Same equipment, same crew, same results — just scaled for your home.
          </p>
        </div>

        <div ref={listRef} className="border-t border-border">
          {RESIDENTIAL.map((svc, i) => (
            <div key={svc.title} className="group grid grid-cols-12 gap-4 py-5 md:py-7 border-b border-border-light items-center cursor-pointer hover:bg-surface-alt/50 -mx-4 px-4 md:-mx-6 md:px-6 transition-colors duration-300">
              <div className="col-span-1 hidden md:block">
                <span className="font-mono text-xs text-text-muted">0{i + 1}</span>
              </div>

              {/* Thumbnail */}
              <div className="col-span-2 md:col-span-1">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden">
                  <img src={svc.img} alt={svc.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
              </div>

              <div className="col-span-6 md:col-span-3">
                <h3 className="font-display font-bold text-base md:text-lg text-text-primary group-hover:text-brand-blue transition-colors">{svc.title}</h3>
              </div>

              <div className="col-span-12 md:col-span-5 order-last md:order-none">
                <p className="text-sm text-text-secondary leading-relaxed">{svc.desc}</p>
              </div>

              <div className="col-span-4 md:col-span-2 flex justify-end">
                <span className="w-9 h-9 rounded-full border border-border-light flex items-center justify-center text-text-muted group-hover:bg-brand-mint group-hover:border-brand-mint group-hover:text-brand-black transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
