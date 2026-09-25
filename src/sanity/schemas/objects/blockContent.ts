import { defineArrayMember, defineType } from 'sanity'
import type { UriValidationOptions, Rule } from 'sanity'

export default defineType({
  name: 'blockContent',
  title: 'Article body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Body', value: 'normal' },
        { title: 'Section heading (H2)', value: 'h2' },
        { title: 'Sub-heading (H3)', value: 'h3' },
        { title: 'Pull quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullets', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (r: Rule) =>
                  r.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  } as UriValidationOptions),
              },
              {
                name: 'newTab',
                type: 'boolean',
                title: 'Open in a new tab',
                initialValue: false,
              },
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Link to another article',
            fields: [
              {
                name: 'reference',
                type: 'reference',
                to: [{ type: 'post' }],
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: 'figure' }),
    defineArrayMember({ type: 'callout' }),
    defineArrayMember({ type: 'ctaBlock' }),
  ],
})
