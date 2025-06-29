import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { message: 'Missing stripe signature' },
        { status: 400 }
      )
    }

    const event = constructWebhookEvent(body, signature)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { message: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

async function handleSubscriptionUpdate(subscription: any) {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: subscription.status === 'active' ? 'active' : 'inactive',
        subscription_id: subscription.id,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', subscription.customer)

    if (error) {
      console.error('Failed to update subscription status:', error)
    }
  } catch (error) {
    console.error('Error handling subscription update:', error)
  }
}

async function handleSubscriptionCanceled(subscription: any) {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', subscription.customer)

    if (error) {
      console.error('Failed to update canceled subscription:', error)
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    // Update user's subscription status to active
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', invoice.customer)

    if (error) {
      console.error('Failed to update payment success:', error)
    }
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    // Update user's subscription status to inactive
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        subscription_status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', invoice.customer)

    if (error) {
      console.error('Failed to update payment failure:', error)
    }
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
} 