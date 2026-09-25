import { defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'question',
      type: 'string',
      description:
        'Phrase it the way a real person would type or say it. That is what gets matched in AI answers.',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'answer',
      type: 'text',
      rows: 4,
      description:
        'Answer in the first sentence, then add detail. 40-90 words works best for featured snippets.',
      validation: (r) => r.required(),
    }),
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
})
