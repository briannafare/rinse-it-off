"use client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { METHODS } from "@/lib/methods";

/** The method-matching system, one card per method — each with its OWN
 *  point-of-view photo so every service reads distinctly. Editorially numbered
 *  so it reads as a system, not a generic feature grid. Copy is straight from
 *  the training material; no invented claims. One accent only (water-blue). */
export function Methods() {
  return (
    <section id="services" className="bg-[#F4F7F8] py-16 md:py-24">
      <div className="container-site">
        <header className="max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-medium text-[#0C1215]">
            <span className="inline-block h-2 w-2 rounded-[3px] bg-[#62C4EB]" aria-hidden />
            The method-matching difference
          </p>
          <h2
            className="mt-3 text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            One company. Six methods. The right one for every surface.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#4B5C6B]">
            Pressure is a tool, not a default. We assess your property first, then match the
            method to each surface — so it comes clean without being blasted.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {METHODS.map((m, i) => (
            <article
              key={m.key}
              className="group overflow-hidden rounded-2xl bg-white ring-1 ring-[#E4ECF1] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_-20px_rgba(20,45,60,0.22)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={m.img}
                  alt={m.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-semibold text-[#0C1215] backdrop-blur-sm">
                  {m.method}
                </span>
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold tracking-[0.08em] text-[#8C9AA5]">
                  Method {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="mt-1 text-lg font-semibold text-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {m.surface}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{m.what}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C1215] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d2830] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get your free property assessment
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <span className="text-sm text-[#5A6B78]">
            Not sure which your property needs? That&apos;s what the assessment is for.
          </span>
        </div>
      </div>
    </section>
  );
}
