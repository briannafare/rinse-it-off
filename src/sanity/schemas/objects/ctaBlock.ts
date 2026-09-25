import { defineField, defineType } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export default defineType({
  name: 'ctaBlock',
  title: 'Call to action',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      initialValue: 'Want us to take a look at your place?',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'text', type: 'text', rows: 2 }),
    defineField({
      name: 'buttonLabel',
      type: 'string',
      initialValue: 'Free assessment',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'buttonHref',
      type: 'string',
      initialValue: '/assessment',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'CTA', subtitle: 'Call to action' }),
  },
})
