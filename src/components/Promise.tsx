"use client";
import Image from "next/image";
import { Droplets, ShieldCheck, Camera } from "lucide-react";
import { useStaggerReveal } from "@/lib/gsap";

// Owners line is Bri's pick (B3, 2026-10-29): they're on plenty of jobs, the crew does most of
// the cleaning. Never say they work every job or that they've stepped back. No review count.
const GOOGLE_REVIEWS = "https://www.google.com/maps?cid=17988257302203001929";

const POINTS: {
  icon: typeof Droplets;
  stat: string | null;
  title: string;
  body: string;
}[] = [
  {
    icon: Camera,
    stat: null,
    title: "Before-and-after photos",
    body: "From every visit. If we missed a spot, the photos will tell on us.",
  },
  {
    icon: Droplets,
    stat: "48h",
    title: "The Clean Water Promise",
    body: "Any spot you're not happy with, we re-rinse free within 48 hours.",
  },
  {
    icon: ShieldCheck,
    stat: null,
    title: "Fully insured",
    body: "Ask and we'll send the certificate the same day.",
  },
];

export function Promise() {
  const gridRef = useStaggerReveal(0.12);

  return (
    <section className="relative overflow-hidden bg-retro-paper py-16 md:py-24">
      {/* soft water aura on the clean-water canvas */}
      <div className="aura-blob left-[-10%] top-[-35%] h-[500px] w-[500px] bg-[#62C4EB]/25 motion-reduce:animate-none" aria-hidden />
      <div className="aura-blob right-[-8%] bottom-[-45%] h-[440px] w-[440px] bg-[#62C4EB]/25 motion-reduce:animate-none" style={{ animationDelay: "-7s" }} aria-hidden />

      <div className="container-site relative">
        <div className="grid items-center gap-6 md:grid-cols-[180px_1fr] md:gap-10">
          <div className="mat relative aspect-[1024/941] w-40 overflow-hidden md:w-full">
            <Image
              src="/brand/photos/owners-bri-alstun.webp"
              alt="Bri and Alstun, the owners of Rinse It Off, in matching Rinse It Off caps"
              fill
              sizes="180px"
              className="object-cover"
            />
          </div>
          <div>
            <h2
              className="text-3xl font-medium text-[#0C1215] md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We&apos;re Bri and Alstun.
            </h2>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-[#3B4247]">
              We own Rinse It Off. We still get our boots wet on plenty of jobs, and the rest go to a
              crew we trust to clean like we do. If something isn&apos;t right, you can always reach
              one of us.
            </p>
            <a
              href={GOOGLE_REVIEWS}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[#1A6E93] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]"
            >
              Read our Google reviews
            </a>
          </div>
        </div>

        <div ref={gridRef} className="mt-10 grid gap-5 md:grid-cols-3 md:mt-14">
          {POINTS.map((p) => (
            <div
              key={p.title}
              className="frame group bg-retro-paper p-7"
            >
              <div className="flex items-center justify-between">
                <p.icon className="h-6 w-6 text-[#1A6E93]" aria-hidden />
              </div>
              <h3
                className="mt-5 text-lg font-medium text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#3B4247]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
