import { asText } from '@prismicio/richtext'
import { GetStaticProps } from 'next'
import { getSession, useSession } from 'next-auth/react'
import { asHTML } from '@prismicio/helpers'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import { Session } from 'next-auth'

import { PrismicDocumentPost } from '../types'
import { PrismicClient } from '../../../services/prismic'
import styles from '../post.module.scss'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface PostPreviewProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session, post.slug, router])

  return (
    <>
      <Head>
        <title>{post.title} | ig.news</title>
      </Head>

      <main className={styles['post-container']}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles['post-content']} ${styles['preview-content']}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles['continue-reading']}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

interface PostPageParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as PostPageParams

  const prismic = PrismicClient()

  const response = await prismic.getByUID<PrismicDocumentPost>(
    'post',
    String(slug)
  )

  const post = {
    slug,
    title: asText(response.data.title),
    content: asHTML(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'en-US',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  }

  return {
    props: { post },
    revalidate: 60 * 30, // 30min
  }
}
