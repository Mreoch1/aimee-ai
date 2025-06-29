import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export const PRICING_PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    description: 'Your AI best friend with unlimited conversations',
    price: 14.99,
    priceId: 'price_basic_monthly', // You'll need to create this in Stripe
    features: [
      'Unlimited text conversations',
      'Memory of your conversations',
      'Basic personality',
      'Morning & evening check-ins',
      'Birthday reminders',
      'Email support'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    description: 'Enhanced AI personality with advanced features',
    price: 24.99,
    priceId: 'price_premium_monthly', // You'll need to create this in Stripe
    features: [
      'Everything in Basic',
      'Advanced AI personality (GPT-4)',
      'Custom conversation styles',
      'Detailed memory insights',
      'Priority support',
      'Early access to new features'
    ]
  }
}

export async function createCustomer(email: string, name: string) {
  return await stripe.customers.create({
    email,
    name,
  })
}

export async function createSubscription(customerId: string, priceId: string) {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  })
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId)
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: priceId,
    }],
    proration_behavior: 'always_invoice',
  })
}

export function constructWebhookEvent(body: string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
} 