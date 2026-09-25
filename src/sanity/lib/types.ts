import type { PortableTextBlock } from '@portabletext/react'
import type { Image } from 'sanity'

export type SanityImage = Image & { alt?: string; caption?: string }

export type Author = {
  name: string
  title?: string
  bio?: string
  headshot?: SanityImage
  links?: string[]
}

export type Faq = { question: string; answer: string }

export type Seo = {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  canonicalUrl?: string
  noIndex?: boolean
}

export type Category = {
  _id: string
  title: string
  slug: string
  description?: string
}

export type PostCard = {
  _id: string
  title: string
  slug: string
  excerpt: string
  date: string
  category?: string
  categoryLabel?: string
  featured?: boolean
  heroImage?: SanityImage
  authorName?: string
}

export type Post = PostCard & {
  updatedAt?: string
  body?: PortableTextBlock[]
  faqs?: Faq[]
  seo?: Seo
  author?: Author
  related?: PostCard[]
}
