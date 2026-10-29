import Image from "next/image";

/** Block 2: one real job, the half-cleaned walkway, with the owners' own published lines. */
export function ProofPhoto() {
  return (
    <section id="proof" className="bg-[#E6F5FC] py-14 md:py-20">
      <div className="container-site grid items-center gap-8 md:grid-cols-[minmax(0,0.75fr)_1fr] md:gap-14">
        <figure>
          <div className="mat relative aspect-[3/4] max-h-[70svh] overflow-hidden">
            <Image
              src="/brand/photos/walkway-split.webp"
              alt="A walkway halfway through a cleaning: the cleaned slabs are light, the untouched ones are dark with algae"
              fill
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-3 text-sm text-[#3B4247]">
            We cleaned one side. You get the idea. The light half is the color this walkway was
            underneath the whole time.
          </figcaption>
        </figure>
        <blockquote
          className="max-w-2xl text-3xl font-medium leading-tight text-[#0C1215] md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The line isn&apos;t an effect.
          <br />
          It&apos;s where we stopped.
        </blockquote>
      </div>
    </section>
  );
}
