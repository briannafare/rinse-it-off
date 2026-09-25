import { groq } from 'next-sanity'

const postCard = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "date": publishedAt,
  "category": category->slug.current,
  "categoryLabel": category->title,
  featured,
  heroImage,
  "authorName": author->name
`

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)]
  | order(publishedAt desc) { ${postCard} }
`

export const categoriesQuery = groq`
  *[_type == "category" && defined(slug.current)]
  | order(order asc, title asc) { _id, title, "slug": slug.current, description }
`

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`

export const postQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${postCard},
    updatedAt,
    body[]{
      ...,
      markDefs[]{
        ...,
        _type == "internalLink" => { "slug": reference->slug.current }
      }
    },
    faqs,
    seo,
    "author": author->{name, title, bio, headshot, links},
    "related": *[
      _type == "post" &&
      slug.current != $slug &&
      category._ref == ^.category._ref
    ] | order(publishedAt desc)[0...3] { ${postCard} }
  }
`

export const sitemapQuery = groq`
  *[_type == "post" && defined(slug.current) && seo.noIndex != true]
  | order(publishedAt desc) {
    "slug": slug.current,
    "date": publishedAt,
    updatedAt
  }
`
