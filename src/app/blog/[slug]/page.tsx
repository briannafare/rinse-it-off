import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { FinalCTA } from "@/components/FinalCTA";
import { FaqSection } from "@/components/blog/FaqSection";
import { PortableBody } from "@/components/blog/PortableBody";
import { PostCard } from "@/components/blog/PostCard";
import { BASE_URL, formatDate } from "@/components/blog/format";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { imageUrl } from "@/sanity/lib/image";
import { postQuery, postSlugsQuery } from "@/sanity/lib/queries";
import type { Post } from "@/sanity/lib/types";

const display = { fontFamily: "var(--font-display)" } as const;

export const revalidate = 300;
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

/** Pre-render whatever is published at build; anything published later is
 *  rendered on first request and cached (ISR). */
export async function generateStaticParams() {
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery);
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

function getPost(slug: string) {
  return sanityFetch<Post | null>({
    query: postQuery,
    params: { slug },
    tags: ["posts", `post:${slug}`],
    fallback: null,
  });
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const canonical = post.seo?.canonicalUrl || `${BASE_URL}/blog/${post.slug}`;
  const og = post.seo?.ogImage?.asset
    ? imageUrl(post.seo.ogImage, 1200, 630)
    : post.heroImage?.asset
      ? imageUrl(post.heroImage, 1200, 630)
      : undefined;

  return {
    // absolute: SEO titles are written whole in Sanity; skip the site template.
    title: post.seo?.metaTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    robots: post.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      siteName: "Rinse It Off",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: og ? [{ url: og, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: og ? "summary_large_image" : "summary",
      title,
      description,
      images: og ? [og] : undefined,
    },
  };
}

function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function structuredData(post: Post) {
  const url = `${BASE_URL}/blog/${post.slug}`;
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt || post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(post.heroImage?.asset ? { image: [imageUrl(post.heroImage, 1200, 630)] } : {}),
    ...(post.author?.name
      ? {
          author: {
            "@type": "Person",
            name: post.author.name,
            ...(post.author.title ? { jobTitle: post.author.title } : {}),
            ...(post.author.links?.length ? { sameAs: post.author.links } : {}),
            worksFor: { "@id": `${BASE_URL}/#business` },
          },
        }
      : {}),
    publisher: { "@id": `${BASE_URL}/#business` },
    ...(post.categoryLabel ? { articleSection: post.categoryLabel } : {}),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const faq = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return [article, breadcrumb, ...(faq ? [faq] : [])];
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = post.related ?? [];

  return (
    <>
      {structuredData(post).map((d, i) => (
        <JsonLd key={i} data={d} />
      ))}

      {/* Title band — dark, so the glass navbar reads the same as every other page */}
      <section className="bg-[#0C1215]">
        <div className="container-site pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="max-w-3xl">
            <Link
              href={post.category ? `/blog?category=${post.category}` : "/blog"}
              className="mb-6 inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#62C4EB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1215]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              {post.categoryLabel ?? "Blog"}
            </Link>
            <h1
              className="text-[clamp(2rem,4.8vw,3.5rem)] leading-[1.04] tracking-[-0.03em] text-white"
              style={{ ...display, fontWeight: 600 }}
            >
              {post.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{post.excerpt}</p>
            <p className="mt-6 text-sm text-white/60">
              {post.author?.name ? `${post.author.name} · ` : ""}
              {formatDate(post.date)}
              {post.updatedAt ? ` · Updated ${formatDate(post.updatedAt)}` : ""}
            </p>
          </div>
        </div>
      </section>

      {post.heroImage?.asset ? (
        <div className="bg-white pt-10 md:pt-14">
          <div className="container-site">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-[#F4F7F8] md:aspect-[21/9]">
              <Image
                src={imageUrl(post.heroImage, 1800)}
                alt={post.heroImage.alt || ""}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}

      <article className="bg-white py-12 md:py-16">
        <div className="container-site">
          <div className="mx-auto max-w-[720px]">
            <PortableBody value={post.body} />
          </div>
        </div>
      </article>

      <FaqSection faqs={post.faqs} />

      {post.author?.bio ? (
        <section className="bg-white py-14">
          <div className="container-site">
            <div className="mx-auto flex max-w-[720px] items-start gap-5 rounded-2xl p-6 ring-1 ring-[#E4ECF1] md:p-7">
              {post.author.headshot?.asset ? (
                <Image
                  src={imageUrl(post.author.headshot, 160, 160)}
                  alt={post.author.headshot.alt || post.author.name}
                  width={64}
                  height={64}
                  className="shrink-0 rounded-xl object-cover"
                />
              ) : null}
              <div>
                <p className="text-sm text-[#8C9AA5]">Written by</p>
                <p className="mt-1 text-lg text-[#0C1215]" style={{ ...display, fontWeight: 600 }}>
                  {post.author.name}
                  {post.author.title ? (
                    <span className="font-normal text-[#4B5C6B]"> · {post.author.title}</span>
                  ) : null}
                </p>
                <p className="mt-2 leading-relaxed text-[#4B5C6B]">{post.author.bio}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="bg-[#F4F7F8] py-16 md:py-20">
          <div className="container-site">
            <h2
              className="mb-8 text-[clamp(1.6rem,3.2vw,2.2rem)] leading-[1.1] tracking-[-0.02em] text-[#0C1215]"
              style={{ ...display, fontWeight: 600 }}
            >
              More from {post.categoryLabel ?? "the blog"}
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <FinalCTA />
    </>
  );
}
