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
    <section id="services" className="bg-retro-pool pb-16 md:pb-24">
      <div className="container-site">
        <header className="max-w-2xl">
          <h2
            className="text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] tracking-[-0.02em] text-[#0C1215]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Six methods, matched to what you actually have.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
            Pressure is a tool, not a default. A mossy roof and a greasy trash pad need
            opposite things, so we look first and then pick the method. Your driveway and a
            client&apos;s parking lot get the same machine and the same care.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {METHODS.map((m) => (
            <article
              key={m.key}
              className="frame group overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={m.img}
                  alt={m.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <div className="p-6">
                {/* the method label sits here, not over the picture, where it covered people's faces */}
                <p className="label-caps inline-block bg-[#62C4EB] px-3 py-1.5 !tracking-[0.14em] text-[#0C1215]">
                  {m.method}
                </p>
                <h3
                  className="mt-3 text-lg font-semibold text-[#0C1215]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {m.surface}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#3B4247]">{m.what}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href="/assessment"
            className="inline-flex items-center gap-2 rounded-full bg-[#F2B632] px-6 py-3.5 text-sm font-semibold text-[#0C1215] transition-colors hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get your free property assessment
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <span className="text-sm text-[#5F676C]">
            Not sure which your property needs? That&apos;s what the assessment is for.
          </span>
        </div>
      </div>
    </section>
  );
}
