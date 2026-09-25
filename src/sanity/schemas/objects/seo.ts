import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: false },
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description:
        'What shows in the Google result. Leave blank to reuse the headline. Google truncates around 60 characters.',
      validation: (r) =>
        r.max(70).warning('Over 70 characters will get cut off in search results.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'The grey text under the blue link. Leave blank to reuse the summary. Write it like ad copy — it drives click-through, not ranking.',
      validation: (r) =>
        r
          .max(165)
          .warning('Over 165 characters will get cut off in search results.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description:
        'Shown when the link is pasted into Facebook, LinkedIn, or iMessage. 1200x630. Falls back to the hero image.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description:
        'Only fill this in if this article was published somewhere else first. Otherwise leave blank.',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
      description:
        'Removes the page from Google and from the sitemap. The page still works if you have the link.',
    }),
  ],
})
