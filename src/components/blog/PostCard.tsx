import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { imageUrl } from "@/sanity/lib/image";
import type { PostCard as PostCardType } from "@/sanity/lib/types";
import { formatDate, postPicture } from "./format";

/** One article in a grid, as the site's printed card: ink keyline, photo or illustration on top. */
export function PostCard({ post }: { post: PostCardType }) {
  const pic = postPicture(post, (img) => imageUrl(img, 800, 500));
  return (
    <li>
      <Link
        href={`/blog/${post.slug}`}
        className="frame group flex h-full flex-col overflow-hidden bg-white transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6E93] focus-visible:ring-offset-2"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b-2 border-[#0C1215] bg-retro-pool">
          <Image
            src={pic.src}
            alt={pic.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="flex flex-1 flex-col p-6 md:p-7">
          {post.categoryLabel ? (
            <p className="label-caps mb-3 !tracking-[0.14em] text-[#1A6E93]">{post.categoryLabel}</p>
          ) : null}
          <h3 className="mb-3 font-title text-[1.35rem] font-black leading-tight text-[#0C1215]">
            {post.title}
          </h3>
          <p className="mb-6 line-clamp-3 flex-1 text-[0.95rem] leading-relaxed text-[#3B4247]">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between border-t border-retro-line pt-4 text-sm text-[#7A8186]">
            <span>
              {formatDate(post.date)}
              {post.authorName ? ` · ${post.authorName}` : ""}
            </span>
            <ArrowUpRight
              className="h-4 w-4 transition-colors group-hover:text-[#1A6E93]"
              aria-hidden
            />
          </div>
        </div>
      </Link>
    </li>
  );
}
