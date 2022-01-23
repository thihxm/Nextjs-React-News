import { GetStaticProps } from 'next'
import Head from 'next/head'
import { asText } from '@prismicio/helpers'

import { PrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'
import Link from 'next/link'
import { PrismicDocumentPost, PrismicTextTypes } from './types'

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
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

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
  }
}
