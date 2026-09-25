import { defineField, defineType } from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export default defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      group: 'content',
      description:
        'What the reader sees at the top of the page. Aim for 50-65 characters.',
      validation: (r) => r.required().max(110),
    }),
    defineField({
      name: 'slug',
      title: 'URL',
      type: 'slug',
      group: 'content',
      description:
        'This becomes rinseitoff.com/blog/your-slug. Changing it on a live post breaks links and loses rankings — add a redirect if you must.',
      options: {
        source: 'title',
        maxLength: 72,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .slice(0, 72),
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'One or two sentences. Shows on the blog index and is the fallback meta description. 120-160 characters.',
      validation: (r) => r.required().min(50).max(200),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      group: 'content',
      to: [{ type: 'category' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      group: 'content',
      to: [{ type: 'author' }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description:
            'Describe the image for screen readers and search engines. Required.',
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Article',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'content',
      of: [{ type: 'faq' }],
      description:
        'Optional. These render at the bottom of the article AND emit FAQPage schema, which is what gets you pulled into AI answers and rich results. Three to five is the sweet spot.',
    }),

    // -------- settings --------
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
      type: 'datetime',
      group: 'settings',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last reviewed',
      type: 'datetime',
      group: 'settings',
      description:
        'Bump this when you refresh an old post. Google reads it as a freshness signal.',
    }),
    defineField({
      name: 'featured',
      title: 'Feature at top of blog',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'needsFullDraft',
      title: 'Still needs work',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description:
        'A note to the reviewer. Has no effect on the live site.',
    }),

    // -------- seo --------
    defineField({ name: 'seo', type: 'seo', group: 'seo' }),
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      media: 'heroImage',
      date: 'publishedAt',
      todo: 'needsFullDraft',
    },
    prepare({ title, subtitle, media, date, todo }) {
      const d = date ? new Date(date).toLocaleDateString('en-US') : 'No date'
      return {
        title: todo ? `\u270E  ${title}` : title,
        subtitle: `${subtitle || 'Uncategorized'} \u00b7 ${d}`,
        media,
      }
    },
  },
})
