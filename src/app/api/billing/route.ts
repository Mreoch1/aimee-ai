import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { action, userPhone } = await request.json();

    if (!userPhone) {
      return NextResponse.json({ error: 'User phone is required' }, { status: 400 });
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', userPhone)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 });
    }

    switch (action) {
      case 'create_portal_session':
        // Create a billing portal session for managing subscriptions
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: user.stripe_customer_id,
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
        });

        return NextResponse.json({ url: portalSession.url });

      case 'cancel_subscription':
        // Get current subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripe_customer_id,
          status: 'active',
          limit: 1,
        });

        if (subscriptions.data.length === 0) {
          return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
        }

        // Cancel the subscription at period end
        const canceledSubscription = await stripe.subscriptions.update(
          subscriptions.data[0].id,
          { cancel_at_period_end: true }
        );

        return NextResponse.json({ 
          success: true, 
          message: 'Subscription will be canceled at the end of the billing period',
          subscription: canceledSubscription
        });

      case 'reactivate_subscription':
        // Get canceled subscription
        const canceledSubscriptions = await stripe.subscriptions.list({
          customer: user.stripe_customer_id,
          status: 'active',
          limit: 1,
        });

        if (canceledSubscriptions.data.length === 0) {
          return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
        }

        // Reactivate the subscription
        const reactivatedSubscription = await stripe.subscriptions.update(
          canceledSubscriptions.data[0].id,
          { cancel_at_period_end: false }
        );

        return NextResponse.json({ 
          success: true, 
          message: 'Subscription has been reactivated',
          subscription: reactivatedSubscription
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Billing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process billing request' 
    }, { status: 500 });
  }
} 