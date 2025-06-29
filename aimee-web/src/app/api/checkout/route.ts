import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { plan, userId, userPhone } = await request.json();

    if (!plan || !userPhone) {
      return NextResponse.json({ error: 'Plan and user phone are required' }, { status: 400 });
    }

    // Get price ID based on plan
    let priceId: string;
    switch (plan) {
      case 'basic':
        priceId = process.env.STRIPE_PRICE_BASIC!;
        break;
      case 'premium':
        priceId = process.env.STRIPE_PRICE_PREMIUM!;
        break;
      default:
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
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

    // Create or get Stripe customer
    let customerId = user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        phone: user.phone,
        name: user.name,
        metadata: {
          user_id: user.id,
          phone: user.phone
        }
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/signup?plan=${plan}&canceled=true`,
      metadata: {
        user_id: user.id,
        phone: user.phone,
        plan: plan
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          phone: user.phone,
          plan: plan
        }
      }
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ 
      error: 'Failed to create checkout session' 
    }, { status: 500 });
  }
} 