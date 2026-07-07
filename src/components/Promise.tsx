"use client";
import Image from "next/image";
import { Droplets, ShieldCheck, BadgeCheck } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";

const POINTS = [
  {
    icon: Droplets,
    stat: "48h",
    title: "The Clean Water Promise",
    body: "Any area you're not happy with, re-rinsed free within 48 hours. No arguing, no fine print.",
  },
  {
    icon: BadgeCheck,
    stat: "6+",
    title: "Method-matched, always",
    body: "Soft wash on siding and roofs, hot water on concrete. Pressure is a tool, not a default.",
  },
  {
    icon: ShieldCheck,
    stat: "COI",
    title: "Licensed & insured",
    body: "Full general liability coverage — certificate of insurance to property managers on request.",
  },
];

export function Promise() {
  const gridRef = useStaggerReveal(0.12);

  return (
    <section className="relative overflow-hidden bg-[#0E1419] py-16 md:py-24">
      {/* cool aura in the dark — the wet-night feel */}
      <div className="aura-blob left-[-10%] top-[-35%] h-[500px] w-[500px] bg-[#62C4EB]/15" aria-hidden />
      <div className="aura-blob right-[-8%] bottom-[-45%] h-[440px] w-[440px] bg-[#4DFFA6]/10" style={{ animationDelay: "-7s" }} aria-hidden />

      <div className="container-site relative">
        <div className="flex items-center gap-4">
          <Image src="/brand/icon-droplet.png" alt="" width={36} height={36} className="h-9 w-9" />
          <h2
            className="text-3xl font-medium text-white md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No surprises, no padding, no fine print.
          </h2>
        </div>

        <div ref={gridRef} className="mt-10 grid gap-5 md:grid-cols-3 md:mt-14">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm transition-colors duration-300 hover:border-[#62C4EB]/40 hover:bg-white/[0.08]"
            >
              <div className="flex items-center justify-between">
                <p.icon className="h-6 w-6 text-[#62C4EB]" aria-hidden />
                <span
                  className="text-4xl font-medium text-white/15 transition-colors duration-300 group-hover:text-[#62C4EB]/40"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {p.stat}
                </span>
              </div>
              <h3
                className="mt-5 text-lg font-medium text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
