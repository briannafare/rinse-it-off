"use client";
import { Droplets, ShieldCheck, BadgeCheck } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";

const POINTS: {
  icon: typeof Droplets;
  stat: string | null;
  title: string;
  body: string;
}[] = [
  {
    icon: Droplets,
    stat: "48h",
    title: "The Clean Water Promise",
    body: "Any area you're not happy with, we re-rinse it free within 48 hours. No arguing, no fine print.",
  },
  {
    icon: BadgeCheck,
    stat: null,
    title: "Method-matched, always",
    body: "Soft wash on siding and roofs, hot water on concrete, pure water on glass. We pick by surface, not by habit.",
  },
  {
    icon: ShieldCheck,
    stat: null,
    title: "Licensed & insured",
    body: "We carry full liability insurance, so your home or your building is covered before we start. Ask and we'll send the certificate the same day.",
  },
];

export function Promise() {
  const gridRef = useStaggerReveal(0.12);

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* soft water aura on the clean-water canvas */}
      <div className="aura-blob left-[-10%] top-[-35%] h-[500px] w-[500px] bg-[#62C4EB]/12 motion-reduce:animate-none" aria-hidden />
      <div className="aura-blob right-[-8%] bottom-[-45%] h-[440px] w-[440px] bg-[#62C4EB]/10 motion-reduce:animate-none" style={{ animationDelay: "-7s" }} aria-hidden />

      <div className="container-site relative">
        <div className="flex items-center gap-4">
          <Droplets className="h-9 w-9 shrink-0 text-[#62C4EB]" aria-hidden />
          <h2
            className="text-3xl font-medium text-[#0C1215] md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            No surprises, no padding, no fine print.
          </h2>
        </div>

        <div ref={gridRef} className="mt-10 grid gap-5 md:grid-cols-3 md:mt-14">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="group rounded-2xl border border-[#E4ECF1] bg-[#FAFCFD] p-7 transition-colors duration-300 hover:border-[#62C4EB]/40 hover:bg-white motion-reduce:transition-none"
            >
              <div className="flex items-center justify-between">
                <p.icon className="h-6 w-6 text-[#62C4EB]" aria-hidden />
                {p.stat && (
                  <span
                    className="text-4xl font-medium text-[#0C1215]/10 transition-colors duration-300 group-hover:text-[#62C4EB]/50 motion-reduce:transition-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.stat}
                  </span>
                )}
              </div>
              <h3
                className="mt-5 text-lg font-medium text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
