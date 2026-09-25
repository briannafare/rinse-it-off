import Image from "next/image";
import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { imageUrl } from "@/sanity/lib/image";

const display = { fontFamily: "var(--font-display)" } as const;

const calloutTone: Record<string, string> = {
  note: "bg-[#EDF7FC] ring-[#62C4EB]/30",
  warning: "bg-[#F4F7F8] ring-[#0C1215]/15",
  stat: "bg-[#0C1215] ring-[#0C1215] [&_p]:!text-white/85 [&_.callout-heading]:!text-white",
};

const linkClass =
  "text-[#0C1215] underline decoration-[#62C4EB] decoration-2 underline-offset-[3px] transition-colors hover:text-[#3AA8D4]";

function slugify(block: PortableTextBlock) {
  const children = (block?.children ?? []) as { text?: string }[];
  return children
    .map((c) => c?.text ?? "")
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-[1.075rem] leading-[1.8] text-[#4B5C6B]">{children}</p>
    ),
    h2: ({ children, value }) => (
      <h2
        id={slugify(value)}
        className="mb-4 mt-14 scroll-mt-28 text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.02em] text-[#0C1215]"
        style={{ ...display, fontWeight: 600 }}
      >
        {children}
      </h2>
    ),
    h3: ({ children, value }) => (
      <h3
        id={slugify(value)}
        className="mb-3 mt-10 scroll-mt-28 text-[1.25rem] leading-snug text-[#0C1215]"
        style={{ ...display, fontWeight: 600 }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-10 border-l-[3px] border-[#62C4EB] pl-6 text-[1.4rem] leading-[1.4] text-[#0C1215]"
        style={{ ...display, fontWeight: 500 }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-5 marker:text-[#62C4EB]">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-[#8C9AA5]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[1.075rem] leading-[1.75] text-[#4B5C6B]">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-[1.075rem] leading-[1.75] text-[#4B5C6B]">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-[#0C1215]">{children}</strong>,
    link: ({ children, value }) => {
      const href: string = value?.href ?? "";
      const external = value?.newTab || /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className={linkClass}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
    internalLink: ({ children, value }) =>
      value?.slug ? (
        <Link href={`/blog/${value.slug}`} className={linkClass}>
          {children}
        </Link>
      ) : (
        <>{children}</>
      ),
  },
  types: {
    figure: ({ value }) =>
      value?.asset ? (
        <figure className="my-12">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#F4F7F8]">
            <Image
              src={imageUrl(value, 1440)}
              alt={value.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="object-cover"
            />
          </div>
          {value.caption ? (
            <figcaption className="mt-3 text-sm text-[#8C9AA5]">{value.caption}</figcaption>
          ) : null}
        </figure>
      ) : null,
    callout: ({ value }) => (
      <aside
        className={`my-10 rounded-2xl p-6 ring-1 md:p-7 ${
          calloutTone[value?.tone as string] ?? calloutTone.note
        }`}
      >
        {value?.heading ? (
          <p
            className="callout-heading mb-2 text-lg text-[#0C1215]"
            style={{ ...display, fontWeight: 600 }}
          >
            {value.heading}
          </p>
        ) : null}
        <div className="[&>p:last-child]:mb-0 [&>p]:mb-3 [&>p]:text-[1rem] [&>p]:leading-[1.7]">
          <PortableText value={value?.text ?? []} components={components} />
        </div>
      </aside>
    ),
    ctaBlock: ({ value }) => (
      <div className="my-14 rounded-3xl bg-[#EDF7FC] px-8 py-10 text-center ring-1 ring-[#62C4EB]/25">
        <p
          className="mb-3 text-[1.6rem] leading-tight text-[#0C1215]"
          style={{ ...display, fontWeight: 600 }}
        >
          {value?.heading}
        </p>
        {value?.text ? (
          <p className="mx-auto mb-6 max-w-md text-[#4B5C6B]">{value.text}</p>
        ) : null}
        <Link
          href={value?.buttonHref ?? "/assessment"}
          className="inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2"
          style={display}
        >
          {value?.buttonLabel} <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    ),
  },
};

export function PortableBody({ value }: { value?: PortableTextBlock[] }) {
  if (!value?.length) return null;
  return <PortableText value={value} components={components} />;
}
