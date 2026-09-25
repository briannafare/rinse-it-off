import { defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

export default defineType({
  name: 'callout',
  title: 'Callout box',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'tone',
      type: 'string',
      initialValue: 'note',
      options: {
        list: [
          { title: 'Note', value: 'note' },
          { title: 'Watch out', value: 'warning' },
          { title: 'Key number', value: 'stat' },
        ],
        layout: 'radio',
      },
    }),
    defineField({ name: 'heading', type: 'string' }),
    defineField({
      name: 'text',
      type: 'array',
      of: [{ type: 'block', styles: [{ title: 'Body', value: 'normal' }] }],
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'tone' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Callout',
      subtitle: `Callout \u00b7 ${subtitle}`,
    }),
  },
})
