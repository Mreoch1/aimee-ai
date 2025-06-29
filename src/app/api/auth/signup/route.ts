import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateVerificationCode, formatPhone } from '@/lib/utils'
import { createCustomer } from '@/lib/stripe'

const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, phone, plan } = await request.json()

    // Validate required fields
    if (!fullName || !email || !phone || !plan) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhone(phone)

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .or(`email.eq.${email},phone.eq.${formattedPhone}`)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email or phone already exists' },
        { status: 409 }
      )
    }

    // Generate verification code
    const verificationCode = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store verification code
    const { error: verificationError } = await supabaseAdmin
      .from('phone_verifications')
      .insert({
        phone: formattedPhone,
        code: verificationCode,
        expires_at: expiresAt.toISOString()
      })

    if (verificationError) {
      console.error('Verification storage error:', verificationError)
      return NextResponse.json(
        { message: 'Failed to store verification code' },
        { status: 500 }
      )
    }

    // Create Stripe customer
    const customer = await createCustomer(email, fullName)

    // Create user record (unverified)
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    
    const { error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        phone: formattedPhone,
        full_name: fullName,
        subscription_status: 'trial',
        trial_ends_at: trialEndsAt.toISOString(),
        stripe_customer_id: customer.id,
        selected_plan: plan
      })

    if (userError) {
      console.error('User creation error:', userError)
      return NextResponse.json(
        { message: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Send verification SMS
    try {
      await twilio.messages.create({
        body: `Your Aimee verification code is: ${verificationCode}. This code expires in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      })
    } catch (twilioError) {
      console.error('SMS sending error:', twilioError)
      // Don't fail the signup if SMS fails - user can request resend
    }

    return NextResponse.json({
      message: 'Account created successfully. Verification code sent.',
      phone: formattedPhone
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 