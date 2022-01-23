import { GetStaticProps } from 'next'
import Head from 'next/head'
import { asHTML, asText } from '@prismicio/helpers'
import PrismicTypes from '@prismicio/types'

import { PrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'

type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Pots | ig.news</title>
      </Head>

      <main className={styles['posts-container']}>
        <div className={styles['posts-list']}>
          {posts.map((post) => (
            <a key={post.slug} href="">
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}

type PrismicDocumentPost = PrismicTypes.PrismicDocument<
  {
    title: PrismicTypes.TitleField
    content: PrismicTypes.RichTextField
  },
  'post',
  'en-us'
>
type PrismicTextTypes = Exclude<
  PrismicTypes.RTNode,
  PrismicTypes.RTImageNode | PrismicTypes.RTEmbedNode
>

export const getStaticProps: GetStaticProps = async () => {
  const prismic = PrismicClient()
  const response = await prismic.getAllByType<PrismicDocumentPost>('post', {
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
  })

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: asText(post.data.title),
      excerpt:
        (
          post.data.content.find(
            (content) => content.type === 'paragraph'
          ) as PrismicTextTypes
        ).text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'en-US',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    }
  })

  return {
    props: { posts },
    // revalidate: 60 * 60 * 24, // 24h
  }
}
