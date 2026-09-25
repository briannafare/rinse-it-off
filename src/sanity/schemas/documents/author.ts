import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'title',
      title: 'Role',
      type: 'string',
      description: 'e.g. Co-owner, field operations',
    }),
    defineField({
      name: 'bio',
      type: 'text',
      rows: 4,
      description: 'Two or three sentences. Shows in the author box under each article.',
    }),
    defineField({
      name: 'headshot',
      type: 'image',
      options: { hotspot: true },
      description: 'Real photo only. Leave empty rather than use a stand-in.',
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'links',
      title: 'Profile links',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Public profiles. Emitted as sameAs in the Article schema.',
    }),
  ],
  preview: { select: { title: 'name', subtitle: 'title', media: 'headshot' } },
})
