import Image from "next/image";
import { Camera, Droplets, ShieldCheck } from "lucide-react";

/** Block 5: who we are, and the promises a customer can check on their own job.
 *  Owners line is Bri's pick (B3, 2026-10-29): the owners are on plenty of jobs, the crew does
 *  most of the cleaning. Never say they work every job, never say they've stepped back.
 *  No review count anywhere (Bri: it makes the business sound like it has barely worked). */
const GOOGLE_REVIEWS = "https://www.google.com/maps?cid=17988257302203001929";

const POINTS = [
  {
    icon: Camera,
    title: "Before-and-after photos",
    body: "You get them from every visit. If we missed a spot, the photos will tell on us.",
  },
  {
    icon: Droplets,
    title: "48-hour re-rinse",
    body: "If a spot isn't right, we re-rinse it free within 48 hours.",
  },
  {
    icon: ShieldCheck,
    title: "Fully insured",
    body: "Ask and we'll send the certificate the same day.",
  },
];

export function Owners() {
  return (
    <section id="owners" className="bg-retro-paper py-14 md:py-20">
      <div className="container-site grid items-center gap-10 md:grid-cols-[minmax(0,0.6fr)_1fr] md:gap-14">
        <div className="mat relative aspect-[1024/941] overflow-hidden">
          <Image
            src="/brand/photos/owners-bri-alstun.webp"
            alt="Bri and Alstun, the owners of Rinse It Off, in matching Rinse It Off caps"
            fill
            sizes="(min-width: 768px) 30vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-medium text-[#0C1215] md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            We&apos;re Bri and Alstun.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#3B4247]">
            We own Rinse It Off. We still get our boots wet on plenty of jobs, and the rest go to a
            crew we trust to clean like we do. If something isn&apos;t right, you can always reach
            one of us.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {POINTS.map((p) => (
              <div key={p.title}>
                <p.icon className="h-6 w-6 text-[#1A6E93]" aria-hidden />
                <h3 className="mt-3 text-base font-semibold text-[#0C1215]">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#3B4247]">{p.body}</p>
              </div>
            ))}
          </div>
          <a
            href={GOOGLE_REVIEWS}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-[#1A6E93] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93]"
          >
            Read our Google reviews
          </a>
        </div>
      </div>
    </section>
  );
}
