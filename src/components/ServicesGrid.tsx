import Image from "next/image";

const SERVICES = [
  {
    icon: "/brand/icons/house-wash.png",
    title: "House Wash",
    body: "Low-pressure soft wash for siding. Kills algae and mildew at the root — no blasting, no damage.",
  },
  {
    icon: "/brand/icons/roof-cleaning.png",
    title: "Roof Cleaning & Moss Treatment",
    body: "Soft-wash treatment that kills moss without pressure. Your shingles keep their granules and their warranty.",
  },
  {
    icon: "/brand/icons/gutter-cleaning.png",
    title: "Gutter Cleaning",
    body: "Full clear-out, downspout flow test, debris hauled away. Overflow never becomes a foundation problem.",
  },
  {
    icon: "/brand/icons/concrete-deck.png",
    title: "Driveway & Concrete",
    body: "Hot water and a rotary surface cleaner — even, streak-free results a rented machine can't match.",
  },
  {
    icon: "/brand/icons/soft-wash.png",
    title: "Deck & Fence Restoration",
    body: "Soft wash, wood brightener, neutralizing rinse. Graying cedar comes back ready for stain.",
  },
  {
    icon: "/brand/icons/gutter-guard.png",
    title: "Window Washing",
    body: "Interior and exterior, screens and tracks included. Streak-free, spot-checked before we leave.",
  },
];

export function ServicesGrid() {
  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div className="container-site">
        <h2
          className="max-w-2xl text-3xl font-medium text-[#0C1215] md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Soft wash for siding. Hot water for concrete. The method matches the surface.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-14">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-[#E4ECF1] bg-[#FAFCFD] p-7 transition-shadow duration-300 hover:shadow-[0_16px_40px_-18px_rgba(20,45,60,0.16)]"
            >
              <Image src={s.icon} alt="" width={44} height={44} className="h-11 w-11" />
              <h3
                className="mt-5 text-lg font-medium text-[#0C1215]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4B5C6B]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
