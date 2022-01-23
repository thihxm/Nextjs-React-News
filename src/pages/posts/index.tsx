import Head from 'next/head'
import styles from './styles.module.scss'

export default function Posts() {
  return (
    <>
      <Head>
        <title>Pots | ig.news</title>
      </Head>

      <main className={styles['posts-container']}>
        <div className={styles['posts-list']}>
          <a href="">
            <time>22 de janeiro de 2022</time>
            <strong>
              Creating a Monorepo with Lerna &amp; Yarn Workspaces
            </strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
          <a href="">
            <time>22 de janeiro de 2022</time>
            <strong>
              Creating a Monorepo with Lerna &amp; Yarn Workspaces
            </strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
          <a href="">
            <time>22 de janeiro de 2022</time>
            <strong>
              Creating a Monorepo with Lerna &amp; Yarn Workspaces
            </strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
          <a href="">
            <time>22 de janeiro de 2022</time>
            <strong>
              Creating a Monorepo with Lerna &amp; Yarn Workspaces
            </strong>
            <p>
              In this guide, you will learn how to create a Monorepo to manage
              multiple packages with a shared build, test, and release process.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
