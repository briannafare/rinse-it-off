"use client";
import { ArrowRight } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";
import { PLAN_BODY, PLAN_EVERY_VISIT, PLAN_HEADLINE, PLAN_NOTE, PLAN_SEASONS as SEASONS } from "@/lib/plan-copy";

/** The yearly plan, on the home page with two ways in: the instant price at
 *  /plan, or reaching us at /contact (Bri 2026-10-19). The paragraph is Bri's
 *  approved plan copy, word for word. Seasons are the plan's real scope. */
export function PlanSection() {
  const ref = useStaggerReveal(0.08);

  return (
    <section id="plan" className="bg-white py-16 md:py-24">
      <div ref={ref} className="container-site grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#3AA8D4]">The yearly plan</p>
          <h2
            className="mt-3 text-3xl font-medium leading-[1.08] tracking-tight text-[#0C1215] md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {PLAN_HEADLINE}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4B5C6B]">
            {PLAN_BODY}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/plan?src=home"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 motion-reduce:transition-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get my price
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center rounded-xl px-6 py-3.5 text-sm font-semibold text-[#0C1215] ring-1 ring-[#E4ECF1] transition-colors hover:bg-[#F4F7F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 motion-reduce:transition-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Talk to us first
            </a>
          </div>
          <p className="mt-4 text-sm text-[#5A6B78]">{PLAN_NOTE}</p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {SEASONS.map((s) => (
            <li key={s.name} className="rounded-2xl bg-[#F4F7F8] p-5 ring-1 ring-[#E4ECF1]">
              <div className="text-lg font-semibold text-[#0C1215]" style={{ fontFamily: "var(--font-display)" }}>{s.name}</div>
              <div className="mt-1 text-[0.95rem] leading-snug text-[#4B5C6B]">{s.work}</div>
            </li>
          ))}
          <li className="rounded-2xl bg-[#0C1215] p-5 sm:col-span-2">
            <div className="text-lg font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>Every visit</div>
            <div className="mt-1 text-[0.95rem] leading-snug text-white/80">{PLAN_EVERY_VISIT}</div>
          </li>
        </ul>
      </div>
    </section>
  );
}
