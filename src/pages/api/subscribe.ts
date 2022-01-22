import { NextApiRequest, NextApiResponse } from 'next'
import { DefaultSession } from 'next-auth'
import { getSession } from 'next-auth/react'
import { fauna } from '../../services/fauna'
import { stripe } from '../../services/stripe'
import { query as q } from 'faunadb'

type User = {
  ref: {
    id: string
  }
  data: {
    email: string
    stripe_customer_id: string
  }
}
export default async function postSubscribeUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = (await getSession({ req })) as Required<DefaultSession>

    const user = await fauna.query<User>(
      q.Get(
        q.Match(q.Index('user_by_email'), q.Casefold(`${session.user.email}`))
      )
    )

    let customerId = user.data.stripe_customer_id

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: `${session.user.email}`,
      })

      customerId = stripeCustomer.id

      await fauna.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: customerId,
          },
        })
      )
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1KKSdyL70ay78IfpJO1ZJYb6',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${process.env.STRIPE_SUCCESS_URL}`,
      cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed')
  }
}
