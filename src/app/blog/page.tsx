import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { FinalCTA } from "@/components/FinalCTA";
import { PostCard } from "@/components/blog/PostCard";
import { BASE_URL } from "@/components/blog/format";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { categoriesQuery, postsQuery } from "@/sanity/lib/queries";
import type { Category, PostCard as PostCardType } from "@/sanity/lib/types";

const PHONE_DISPLAY = "(971) 626-4146";
const PHONE_TEL = "tel:+19716264146";
const display = { fontFamily: "var(--font-display)" } as const;

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog — Exterior Cleaning Answers for Portland Homes & Properties",
  description:
    "Straight answers about roofs, siding, concrete, storefronts and the Portland rain that gets on all of them. Written by Bri and Alstun, the owners of Rinse It Off.",
  alternates: { canonical: `${BASE_URL}/blog` },
};

/** Shown only if Sanity has no categories yet (or can't be reached), so the
 *  empty state never renders blank. Mirrors the seeded category docs. */
const FALLBACK_CATEGORIES: Category[] = [
  { _id: "homes", slug: "homes", title: "Homes", description: "Roofs, siding, driveways, decks and windows at your house." },
  { _id: "commercial", slug: "commercial", title: "Commercial", description: "Storefronts, parking lots, HOAs and multi-building sites." },
  { _id: "seasonal", slug: "seasonal", title: "Seasonal", description: "What the Portland weather is doing to your property this time of year." },
];

type SearchParams = Promise<{ category?: string }>;

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-11 shrink-0 items-center rounded-lg px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 ${
        active
          ? "bg-[#0C1215] text-white"
          : "bg-white text-[#4B5C6B] ring-1 ring-[#E4ECF1] hover:text-[#0C1215] hover:ring-[#62C4EB]/50"
      }`}
      style={display}
    >
      {children}
    </Link>
  );
}

export default async function BlogIndexPage({ searchParams }: { searchParams: SearchParams }) {
  const { category: activeCategory } = await searchParams;

  const [posts, fetchedCategories] = await Promise.all([
    sanityFetch<PostCardType[]>({ query: postsQuery, tags: ["posts"], fallback: [] }),
    sanityFetch<Category[]>({ query: categoriesQuery, tags: ["category"], fallback: [] }),
  ]);
  const categories = fetchedCategories.length ? fetchedCategories : FALLBACK_CATEGORIES;

  const filtered = activeCategory ? posts.filter((p) => p.category === activeCategory) : posts;
  const featured = !activeCategory ? (posts.find((p) => p.featured) ?? posts[0]) : undefined;
  const rest = featured ? filtered.filter((p) => p._id !== featured._id) : filtered;
  const hasPosts = posts.length > 0;

  return (
    <>
      {/* Hero — dark image band, same construction as /areas */}
      <section className="relative w-full overflow-hidden bg-[#0C1215]">
        <Image
          src="/brand/photos/work/lot-steam-wide.webp"
          alt="A Rinse It Off technician running a surface cleaner across a wet parking lot on an overcast day, steam rising"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" aria-hidden />
        <div className="container-site relative z-10 flex flex-col justify-end pb-14 pt-32 md:pb-20 md:pt-40">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium text-white/85">The Rinse It Off blog</p>
            <h1
              className="text-[clamp(2rem,5.4vw,4rem)] leading-[1.02] tracking-[-0.03em] text-white"
              style={{ ...display, fontWeight: 600 }}
            >
              Straight answers from the people doing the <span className="text-[#62C4EB]">washing.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">
              Roofs, siding, concrete, storefronts, and the Portland rain that gets on all of them.
              Written by Bri and Alstun, who own the company.
            </p>
          </div>
        </div>
      </section>

      {hasPosts ? (
        <>
          {/* Filter */}
          <section className="border-b border-[#E4ECF1] bg-white py-6">
            <nav aria-label="Filter articles by category" className="container-site">
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                <FilterLink href="/blog" active={!activeCategory}>
                  All articles
                </FilterLink>
                {categories.map((c) => (
                  <FilterLink key={c._id} href={`/blog?category=${c.slug}`} active={activeCategory === c.slug}>
                    {c.title}
                  </FilterLink>
                ))}
              </div>
            </nav>
          </section>

          {/* Featured */}
          {featured ? (
            <section className="bg-white pt-12 md:pt-16">
              <div className="container-site">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid overflow-hidden rounded-3xl bg-[#F4F7F8] ring-1 ring-[#E4ECF1] transition-shadow hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 md:grid-cols-2"
                >
                  {featured.heroImage?.asset ? (
                    <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[360px]">
                      <FeaturedImage post={featured} />
                    </div>
                  ) : null}
                  <div className={`flex flex-col justify-center p-8 md:p-12 ${featured.heroImage?.asset ? "" : "md:col-span-2"}`}>
                    {featured.categoryLabel ? (
                      <p className="mb-3 text-sm font-medium text-[#3AA8D4]">{featured.categoryLabel}</p>
                    ) : null}
                    <h2
                      className="mb-4 text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.08] tracking-[-0.02em] text-[#0C1215]"
                      style={{ ...display, fontWeight: 600 }}
                    >
                      {featured.title}
                    </h2>
                    <p className="mb-6 max-w-xl text-lg leading-relaxed text-[#4B5C6B]">{featured.excerpt}</p>
                    <span className="inline-flex items-center gap-2 font-semibold text-[#0C1215]" style={display}>
                      Read it
                      <ArrowRight className="h-4 w-4 text-[#62C4EB] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
                    </span>
                  </div>
                </Link>
              </div>
            </section>
          ) : null}

          {/* Grid */}
          <section className="bg-white py-12 md:py-16">
            <div className="container-site">
              {rest.length ? (
                <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <PostCard key={p._id} post={p} />
                  ))}
                </ul>
              ) : activeCategory ? (
                <p className="text-lg text-[#4B5C6B]">
                  Nothing in this category yet.{" "}
                  <Link href="/blog" className="text-[#0C1215] underline decoration-[#62C4EB] decoration-2 underline-offset-[3px]">
                    See every article
                  </Link>
                  .
                </p>
              ) : null}
            </div>
          </section>
        </>
      ) : (
        /* Empty state — reads as "coming", not "broken" */
        <section className="bg-[#F4F7F8] py-16 md:py-24">
          <div className="container-site">
            <header className="max-w-2xl">
              <h2
                className="text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.08] tracking-[-0.02em] text-[#0C1215]"
                style={{ ...display, fontWeight: 600 }}
              >
                The first articles are being written now.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[#4B5C6B]">
                They&rsquo;ll cover three topics. If you have a question you&rsquo;d like us to
                answer first, call or text us and it goes to the top of the list.
              </p>
            </header>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {categories.map((c) => (
                <li key={c._id} className="rounded-2xl bg-white p-6 ring-1 ring-[#E4ECF1] md:p-7">
                  <p className="mb-2 text-xl text-[#0C1215]" style={{ ...display, fontWeight: 600 }}>
                    {c.title}
                  </p>
                  {c.description ? <p className="leading-relaxed text-[#4B5C6B]">{c.description}</p> : null}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={PHONE_TEL}
                className="group inline-flex items-center gap-2 rounded-xl bg-[#62C4EB] px-6 py-3.5 font-semibold text-[#0C1215] transition-colors hover:bg-[#7CD0EF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F7F8]"
                style={display}
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call or text {PHONE_DISPLAY}
              </a>
              <Link
                href="/services"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-1 font-semibold text-[#0C1215] hover:text-[#3AA8D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB]"
                style={display}
              >
                See what we clean
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}

function FeaturedImage({ post }: { post: PostCardType }) {
  if (!post.heroImage?.asset) return null;
  return (
    <Image
      src={imageUrl(post.heroImage, 1200, 800)}
      alt={post.heroImage.alt || ""}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
    />
  );
}
