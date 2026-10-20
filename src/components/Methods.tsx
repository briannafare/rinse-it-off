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
        <header className="max-w-4xl">
          <h2 className="text-[#0C1215]">
            Six methods, matched to what you actually have.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#3B4247]">
            Pressure is a tool, not a default. A mossy roof and a greasy trash pad need
            opposite things, so we look first and then pick the method. Your driveway and a
            client&apos;s parking lot get the same machine and the same care.
          </p>
        </header>

        <div className="mt-12 grid gap-x-10 gap-y-14 md:mt-16 md:grid-cols-2">
          {METHODS.map((m) => (
            <div
              key={m.key}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={m.img}
                  alt={m.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <div className="pt-5">
                <h3 className="text-[#0C1215]">{m.surface}</h3>
                <p className="mt-2 text-lg font-bold text-[#1A6E93]">{m.method}</p>
                <p className="mt-2 text-lg leading-relaxed text-[#3B4247]">{m.what}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <a
            href="/assessment"
            className="btn-print bg-[#F2B632] text-[#0C1215] hover:bg-[#F6C451] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1A6E93]"
          >
            Get your free property assessment
            <ArrowRight className="h-6 w-6" aria-hidden />
          </a>
          <span className="text-lg text-[#3B4247]">
            Not sure which your property needs? That&apos;s what the assessment is for.
          </span>
        </div>
      </div>
    </section>
  );
}
