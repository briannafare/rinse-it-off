"use client";
import Image from "next/image";
import { Phone } from "lucide-react";
import { IridescentCTA } from "./IridescentCTA";

/** The closer: show them the after — a patio you'd actually sit in. */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[70vh] min-h-[480px]">
        <Image
          src="/brand/photos/patio-umbrellas.jpg"
          alt="A freshly washed patio with bright blue umbrellas and a fire pit, ready for guests"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1215]/85 via-black/30 to-black/10" />

        <div className="container-site relative flex h-full flex-col items-start justify-end pb-16 md:pb-20">
          <h2
            className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            This patio was gray last week.
            <br />
            <span style={{ color: "#62C4EB" }}>Yours is next.</span>
          </h2>
          <p className="mt-4 max-w-lg text-lg text-white/85">
            Same-day quote, 50% books your date, and you approve the work
            before the balance charges.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <IridescentCTA href="/assessment" finish="iri-ink">
              Get your same-day quote
            </IridescentCTA>
            <a
              href="tel:+15037043755"
              className="flex items-center gap-2 text-sm font-medium text-white/85 hover:text-white"
            >
              <Phone className="h-4 w-4" aria-hidden />
              (503) 704-3755 — talk to Kenn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
