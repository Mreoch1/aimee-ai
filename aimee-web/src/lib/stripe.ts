import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export function constructWebhookEvent(body: string, signature: string) {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
  
  try {
    return stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    throw new Error('Invalid webhook signature')
  }
} 