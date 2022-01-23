import { asText } from '@prismicio/richtext'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from 'next'
import { getSession } from 'next-auth/react'
import { asHTML } from '@prismicio/helpers'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import { Session } from 'next-auth'

import { PrismicDocumentPost } from './types'
import { PrismicClient } from '../../services/prismic'
import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

export default function Post({ post }: PostProps) {
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
            className={styles['post-content']}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </article>
      </main>
    </>
  )
}

interface PostPageParams extends ParsedUrlQuery {
  slug: string
}

interface UserSession extends Session {
  activeSubscription: string
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = (await getSession({ req })) as UserSession
  const { slug } = params as PostPageParams

  if (!session.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const prismic = PrismicClient()

  const response = await prismic.getByUID<PrismicDocumentPost>(
    'post',
    String(slug)
  )

  const post = {
    slug,
    title: asText(response.data.title),
    content: asHTML(response.data.content),
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
  }
}
