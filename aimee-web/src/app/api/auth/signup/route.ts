import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import twilio from 'twilio'

export const dynamic = 'force-dynamic'

// Simple rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function rateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now()
  const key = ip
  const record = rateLimitStore.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!rateLimit(ip)) {
      return NextResponse.json({ 
        error: 'Too many requests. Please try again later.' 
      }, { status: 429 })
    }

    console.log('Environment check:', {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? 'SET' : 'NOT SET'
    });
    
    const { name, phone, email, plan = 'free', step } = await request.json()
    
    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Valid name is required' }, { status: 400 })
    }
    
    if (!phone || !validatePhone(phone)) {
      return NextResponse.json({ error: 'Valid phone number is required' }, { status: 400 })
    }
    
    if (email && !validateEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    
    if (!['free', 'basic', 'premium'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 })
    }
    
    if (step === 'verify-phone') {
      // Step 1: Send verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

      // Check if user already exists
      let { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id, phone_verified, name, email')
        .eq('phone', phone)
        .single()

      if (userError && userError.code !== 'PGRST116') {
        throw userError
      }

      if (existingUser) {
        // Update existing user with verification code
        const { error: updateError } = await supabase
          .from('users')
          .update({
            verification_code: verificationCode,
            verification_expires_at: expiresAt.toISOString(),
            name: name || existingUser.name,
            email: email || existingUser.email
          })
          .eq('id', existingUser.id)

        if (updateError) throw updateError
      } else {
        // Create new user
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            name,
            phone,
            email,
            subscription_tier: plan,
            phone_verified: false,
            verification_code: verificationCode,
            verification_expires_at: expiresAt.toISOString()
          })

        if (insertError) throw insertError
      }

      // Send verification code via SMS
      try {
        await twilioClient.messages.create({
          body: `Your Aimee verification code is: ${verificationCode}. This code expires in 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Verification code sent successfully',
          nextStep: 'confirm-code'
        })
      } catch (twilioError) {
        console.error('Error sending SMS:', twilioError)
        return NextResponse.json({ 
          error: 'Failed to send verification code. Please try again.' 
        }, { status: 500 })
      }
    }

    if (step === 'confirm-code') {
      // Step 2: Verify code and complete registration
      const { verificationCode } = await request.json()

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single()

      if (userError || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Check if code is valid and not expired
      const now = new Date()
      const expiresAt = new Date(user.verification_expires_at)

      if (!user.verification_code || user.verification_code !== verificationCode) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
      }

      if (now > expiresAt) {
        return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 })
      }

      // Update user as verified
      const { error: updateError } = await supabase
        .from('users')
        .update({
          phone_verified: true,
          verification_code: null,
          verification_expires_at: null,
          subscription_tier: plan
        })
        .eq('id', user.id)

      if (updateError) throw updateError

      // For paid plans, create Stripe checkout session
      if (plan !== 'free') {
        try {
          const checkoutResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              plan,
              userId: user.id,
              userPhone: phone
            })
          });

          if (!checkoutResponse.ok) {
            throw new Error('Failed to create checkout session');
          }

          const { url } = await checkoutResponse.json();

          return NextResponse.json({
            success: true,
            message: 'Phone verified successfully',
            nextStep: 'payment',
            checkoutUrl: url
          });
        } catch (checkoutError) {
          console.error('Checkout creation error:', checkoutError);
          return NextResponse.json({
            error: 'Failed to create payment session'
          }, { status: 500 });
        }
      }

      // For free plan, registration is complete
      // Send welcome message
      try {
        await twilioClient.messages.create({
          body: `Welcome to Aimee! 💛 I'm so excited to be your AI best friend. I'm here 24/7 to chat, remember what matters to you, and be the friend you've always wanted. You get 50 free messages this month - let's make them count! What's on your mind today?`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone
        })
      } catch (twilioError) {
        console.error('Error sending welcome SMS:', twilioError)
        // Don't fail the registration if welcome message fails
      }

      return NextResponse.json({
        success: true,
        message: 'Registration completed successfully!',
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          plan: plan
        },
        nextStep: 'complete'
      })
    }

    return NextResponse.json({ error: 'Invalid step' }, { status: 400 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 