import type { StructureResolver } from 'sanity/structure'
import { DocumentTextIcon, EditIcon, StarIcon, TagIcon, UserIcon } from '@sanity/icons'

/** Review queue first: drafts written by the content engine land there. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Rinse It Off Blog')
    .items([
      S.listItem()
        .title('Needs review')
        .icon(EditIcon)
        .child(
          S.documentTypeList('post')
            .title('Needs review')
            .filter('_type == "post" && _id in path("drafts.**")')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      S.listItem()
        .title('All articles')
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList('post')
            .title('All articles')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),
      S.listItem()
        .title('Featured')
        .icon(StarIcon)
        .child(
          S.documentTypeList('post')
            .title('Featured')
            .filter('_type == "post" && featured == true')
        ),
      S.divider(),
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Categories')),
      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('author').title('Authors')),
    ])
