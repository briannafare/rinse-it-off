import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { imageUrl } from "@/sanity/lib/image";
import type { PostCard as PostCardType } from "@/sanity/lib/types";
import { formatDate } from "./format";

/** One article in a grid. Soft rectangle, hairline ring, water-blue on hover. */
export function PostCard({ post }: { post: PostCardType }) {
  return (
    <li>
      <Link
        href={`/blog/${post.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-[4px] bg-white ring-1 ring-retro-line transition-shadow hover:ring-[#2F6B66]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B66] focus-visible:ring-offset-2"
      >
        {post.heroImage?.asset ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-retro-pool">
            <Image
              src={imageUrl(post.heroImage, 800, 500)}
              alt={post.heroImage.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
        ) : null}
        <div className="flex flex-1 flex-col p-6 md:p-7">
          {post.categoryLabel ? (
            <p className="mb-3 text-sm font-medium text-[#2F6B66]">{post.categoryLabel}</p>
          ) : null}
          <h3
            className="mb-3 text-xl leading-snug tracking-[-0.01em] text-[#26211B]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            {post.title}
          </h3>
          <p className="mb-6 line-clamp-3 flex-1 text-[0.95rem] leading-relaxed text-[#4A4238]">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between border-t border-retro-line pt-4 text-sm text-[#8A8072]">
            <span>
              {formatDate(post.date)}
              {post.authorName ? ` · ${post.authorName}` : ""}
            </span>
            <ArrowUpRight
              className="h-4 w-4 transition-colors group-hover:text-[#2F6B66]"
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
