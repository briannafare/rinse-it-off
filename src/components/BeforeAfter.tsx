import Image from "next/image";

/** Proof, documentary style. Every photo already contains its own before and
 *  after — the clean/dirty line is real, so we present it straight. */
const SHOTS = [
  {
    src: "/brand/photos/before-after-concrete.jpg",
    alt: "Sidewalk half black with grime, half freshly cleaned, the surface cleaner still in frame",
    caption: "Same sidewalk, one pass. The machine is still in the shot.",
    tall: true,
  },
  {
    src: "/brand/photos/walkway-split.jpg",
    alt: "A clubhouse walkway mid-clean, the cleaned slabs bright against the untouched dark ones",
    caption: "Clubhouse walkway, Gresham — halfway through the job.",
    tall: true,
  },
  {
    src: "/brand/photos/curb-dramatic.jpg",
    alt: "A curb line showing cleaned concrete meeting weathered concrete",
    caption: "The line isn't an effect. It's where we stopped for the photo.",
    tall: true,
  },
];

export function BeforeAfter() {
  return (
    <section id="proof" className="bg-[#F4F7F8] py-16 md:py-24">
      <div className="container-site">
        <h2
          className="max-w-2xl text-3xl font-medium text-[#0C1215] md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The moment dirt lets go.
        </h2>
        <p className="mt-3 max-w-xl text-[#4B5C6B]">
          No staging, no stock photography. Each shot is a real Portland-metro
          job with the before and after in the same frame.
        </p>

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {SHOTS.map((s) => (
            <figure key={s.src} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[#E4ECF1]">
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-3 text-sm text-[#4B5C6B]">{s.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
