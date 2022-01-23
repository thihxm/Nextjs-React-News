import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import SubscribeButton from '../components/SubscribeButton'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

const Home: NextPage<HomeProps> = ({ product }) => {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles['content-container']}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KKSdyL70ay78IfpJO1ZJYb6')

  const product = {
    priceId: price.id,
    amount: Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(price.unit_amount) / 100),
  }

  return {
    props: { product },
    revalidate: 60 * 60 * 24, // 24h
  }
}
