import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export default defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      description: 'Describe what is in the image. Required.',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'caption', type: 'string', title: 'Caption' }),
  ],
  preview: { select: { title: 'caption', subtitle: 'alt', media: 'asset' } },
})
