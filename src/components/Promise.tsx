const POINTS = [
  {
    title: "The Clean Water Promise",
    body: "If any area isn't right, tell us within 48 hours and we re-rinse it free. No arguing, no fine print.",
  },
  {
    title: "Method-matched, always",
    body: "Soft wash on siding and roofs, hot water on concrete. Pressure is a tool, not a default.",
  },
  {
    title: "Licensed & insured",
    body: "Full general liability coverage. COI available to property managers on request.",
  },
];

export function Promise() {
  return (
    <section className="bg-[#0E1419] py-16 md:py-24">
      <div className="container-site">
        <h2
          className="max-w-2xl text-3xl font-medium text-white md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          No surprises, no padding, no fine print.
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3 md:mt-14">
          {POINTS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
              <h3
                className="text-lg font-medium text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
