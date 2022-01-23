import { Session } from 'next-auth'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'
import styles from './styles.module.scss'

interface SubscribeButtonProps {
  priceId: string
}

interface UserSession extends Session {
  activeSubscription: string
}

export default function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data } = useSession()
  const session = data as UserSession
  const router = useRouter()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    if (session.activeSubscription) {
      router.push('/posts')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <button
      type="button"
      className={styles['subscribe-button']}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}
