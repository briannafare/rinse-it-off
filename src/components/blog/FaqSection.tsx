import type { Faq } from "@/sanity/lib/types";

/** Article FAQs. Same questions feed the FAQPage JSON-LD on the post page. */
export function FaqSection({ faqs }: { faqs?: Faq[] }) {
  if (!faqs?.length) return null;
  return (
    <section className="bg-[#F4F7F8] py-16 md:py-20">
      <div className="container-site">
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-8 text-[clamp(1.6rem,3.2vw,2.2rem)] leading-[1.1] tracking-[-0.02em] text-[#0C1215]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Common questions
          </h2>
          <div className="divide-y divide-[#E4ECF1] rounded-2xl bg-white px-6 ring-1 ring-[#E4ECF1] md:px-8">
            {faqs.map((f, i) => (
              <details key={i} className="group py-5" open={i === 0}>
                <summary
                  className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg leading-snug text-[#0C1215] [&::-webkit-details-marker]:hidden"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
                >
                  {f.question}
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-xl text-[#62C4EB] transition-transform group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-[1.75] text-[#4B5C6B]">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
