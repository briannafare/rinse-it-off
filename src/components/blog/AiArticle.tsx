import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FinalCTA } from "@/components/FinalCTA";
import { FaqSection } from "@/components/blog/FaqSection";
import { BASE_URL } from "@/components/blog/format";
import { AI_PAGES, isPublishable, type AiPage, type Block } from "@/lib/ai-pages";
import { OG } from "@/lib/seo";

const display = { fontFamily: "var(--font-display)" } as const;
const linkClass =
  "text-[#0C1215] underline decoration-[#2E9BC6] decoration-2 underline-offset-[3px] transition-colors hover:text-[#1A6E93] break-words";

/** Inline markdown -> React nodes. No HTML is ever injected. */
function Inline({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|(https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2]) {
      const href = m[2];
      const ext = /^https?:\/\//.test(href);
      out.push(
        ext ? (
          <a key={k++} href={href} className={linkClass} target="_blank" rel="noopener noreferrer">
            <Inline text={m[1]} />
          </a>
        ) : (
          <Link key={k++} href={href} className={linkClass}>
            <Inline text={m[1]} />
          </Link>
        ),
      );
    } else if (m[3]) {
      out.push(
        <strong key={k++} className="font-semibold text-[#0C1215]">
          <Inline text={m[3]} />
        </strong>,
      );
    } else if (m[4]) {
      out.push(<em key={k++}>{m[4]}</em>);
    } else if (m[5]) {
      out.push(
        <a key={k++} href={m[5]} className={linkClass} target="_blank" rel="noopener noreferrer">
          {m[5]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h1":
            return null; // the title band carries the H1
          case "h2":
            return (
              <h2
                key={i}
                className="mb-4 mt-14 scroll-mt-28 text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.02em] text-[#0C1215]"
                style={{ ...display, fontWeight: 600 }}
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mb-3 mt-10 scroll-mt-28 text-[1.25rem] leading-snug text-[#0C1215]" style={{ ...display, fontWeight: 600 }}>
                {b.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="mb-6 text-[1.075rem] leading-[1.8] text-[#3B4247]">
                <Inline text={b.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="mb-6 list-disc space-y-2 pl-5 marker:text-[#1A6E93]">
                {b.items.map((it, j) => (
                  <li key={j} className="text-[1.075rem] leading-[1.75] text-[#3B4247] break-words">
                    <Inline text={it} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mb-6 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-[#7A8186]">
                {b.items.map((it, j) => (
                  <li key={j} className="text-[1.075rem] leading-[1.75] text-[#3B4247]">
                    <Inline text={it} />
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="mb-8 overflow-x-auto rounded-[4px] ring-1 ring-retro-line">
                <table className="w-full min-w-[34rem] border-collapse text-left text-[0.975rem] leading-relaxed">
                  <thead className="bg-retro-pool text-[#0C1215]">
                    <tr>
                      {b.head.map((c, j) => (
                        <th key={j} scope="col" className="px-4 py-3 font-semibold" style={display}>
                          <Inline text={c} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4DCCD] text-[#3B4247]">
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((c, n) => (
                          <td key={n} className="px-4 py-3 align-top">
                            <Inline text={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "hr":
            return <hr key={i} className="my-10 border-retro-line" />;
          case "faq":
            return null; // shown in the Common questions section below
        }
      })}
    </>
  );
}

/** Where each piece points next: the page that sells what it explains. */
const NEXT_STEP: Record<AiPage["kind"], { href: string; label: string }> = {
  blog: { href: "/plan", label: "See the yearly plan price for your house" },
  compare: { href: "/plan", label: "See the yearly plan price for your house" },
  commercial: { href: "/commercial", label: "How we work with property managers and HOAs" },
};

/** Links to the other answer pages, so none of them is an orphan and the set
 *  reads to a crawler as one connected body of answers. */
function RelatedReading({ page }: { page: AiPage }) {
  const others = AI_PAGES.filter((p) => p.path !== page.path && isPublishable(p))
    .sort((a, b) => Number(b.kind === page.kind) - Number(a.kind === page.kind))
    .slice(0, 4);
  const next = NEXT_STEP[page.kind];
  return (
    <nav aria-labelledby="related-reading" className="bg-white pb-12 md:pb-16">
      <div className="container-site">
        <div className="mx-auto max-w-[720px] border-t border-[#E4DCCD] pt-8">
          <h2 id="related-reading" className="text-xl font-semibold text-[#0C1215]" style={display}>
            More straight answers
          </h2>
          <ul className="mt-4 space-y-2">
            {others.map((p) => (
              <li key={p.path}>
                <Link href={p.path} className={linkClass}>
                  {p.h1}
                </Link>
              </li>
            ))}
            <li>
              <Link href={next.href} className={linkClass}>
                {next.label}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

/** Page template for the AI-search pieces. Same title band, article column,
 *  FAQ section and closing CTA as /blog/[slug]; the copy is printed as written. */
export function AiArticle({ page }: { page: AiPage }) {
  const url = `${BASE_URL}${page.path}`;
  const parent =
    page.kind === "blog"
      ? { name: "Blog", href: "/blog" }
      : page.kind === "commercial"
        ? { name: "Commercial", href: "/commercial" }
        : { name: "Services", href: "/services" };

  // Body: everything before the FAQ heading, then the FAQs, then what follows them.
  const faqStart = page.blocks.findIndex((b) => b.t === "faq");
  const faqHeading = faqStart > 0 && page.blocks[faqStart - 1].t === "h2" ? faqStart - 1 : -1;
  const before = faqStart === -1 ? page.blocks : page.blocks.slice(0, faqHeading === -1 ? faqStart : faqHeading);
  let afterIdx = faqStart;
  while (afterIdx !== -1 && afterIdx < page.blocks.length && page.blocks[afterIdx].t === "faq") afterIdx++;
  const after = faqStart === -1 ? [] : page.blocks.slice(afterIdx);
  const faqHeadingText = faqHeading === -1 ? "Common questions" : (page.blocks[faqHeading] as { text: string }).text;

  const article = {
    "@context": "https://schema.org",
    "@type": page.kind === "blog" ? "BlogPosting" : "Article",
    headline: page.h1,
    description: page.description,
    datePublished: page.checked,
    dateModified: page.checked,
    image: [`${BASE_URL}${page.kind === "commercial" ? OG.commercial.url : OG.blog.url}`],
    inLanguage: "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@id": `${BASE_URL}/#business` },
    publisher: { "@id": `${BASE_URL}/#business` },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: parent.name, item: `${BASE_URL}${parent.href}` },
      { "@type": "ListItem", position: 3, name: page.h1, item: url },
    ],
  };
  const faq = page.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      }
    : null;

  // The standfirst is the first paragraph (the direct answer); the byline is the italic paragraph after it.
  const firstP = before.findIndex((b) => b.t === "p");
  const lede = firstP === -1 ? null : (before[firstP] as { text: string }).text;
  const rest = firstP === -1 ? before : before.filter((_, i) => i !== firstP);

  return (
    <>
      {[article, breadcrumb, ...(faq ? [faq] : [])].map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}

      <section className="bg-[#62C4EB]">
        <div className="container-site pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="max-w-3xl">
            <Link
              href={parent.href}
              className="mb-6 inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-[#0C1215]/75 transition-colors hover:text-[#0C1215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#62C4EB]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {parent.name}
            </Link>
            <h1 className="text-[clamp(2rem,4.8vw,3.5rem)] leading-[1.04] tracking-[-0.03em] text-[#0C1215]" style={{ ...display, fontWeight: 600 }}>
              {page.h1}
            </h1>
            {lede ? (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#0C1215]/80">
                <Inline text={lede} />
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <article className="bg-white py-12 md:py-16">
        <div className="container-site">
          <div className="mx-auto max-w-[720px]">
            <Blocks blocks={rest} />
          </div>
        </div>
      </article>

      <FaqSection
        faqs={page.faqs.map((f) => ({ question: f.question, answer: f.answerRaw }))}
        heading={faqHeadingText}
        renderAnswer={(a) => <Inline text={a} />}
      />

      {after.length ? (
        <article className="bg-white py-12 md:py-16">
          <div className="container-site">
            <div className="mx-auto max-w-[720px]">
              <Blocks blocks={after} />
            </div>
          </div>
        </article>
      ) : null}

      <RelatedReading page={page} />

      <FinalCTA />
    </>
  );
}
