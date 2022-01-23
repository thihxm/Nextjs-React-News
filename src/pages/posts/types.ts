import type PrismicTypes from '@prismicio/types'

export type PrismicDocumentPost = PrismicTypes.PrismicDocument<
  {
    title: PrismicTypes.TitleField
    content: PrismicTypes.RichTextField
  },
  'post',
  'en-us'
>

export type PrismicTextTypes = Exclude<
  PrismicTypes.RTNode,
  PrismicTypes.RTImageNode | PrismicTypes.RTEmbedNode
>
