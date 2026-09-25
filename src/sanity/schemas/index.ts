import { type SchemaTypeDefinition } from 'sanity'

import post from './documents/post'
import author from './documents/author'
import category from './documents/category'

import blockContent from './objects/blockContent'
import seo from './objects/seo'
import callout from './objects/callout'
import ctaBlock from './objects/ctaBlock'
import figure from './objects/figure'
import faq from './objects/faq'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  category,
  blockContent,
  seo,
  callout,
  ctaBlock,
  figure,
  faq,
]
