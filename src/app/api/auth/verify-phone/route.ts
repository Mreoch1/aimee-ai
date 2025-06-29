import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { formatPhone } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()

    if (!phone || !code) {
      return NextResponse.json(
        { message: 'Phone and code are required' },
        { status: 400 }
      )
    }

    const formattedPhone = formatPhone(phone)

    // Get verification record
    const { data: verification, error: verificationError } = await supabaseAdmin
      .from('phone_verifications')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('code', code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (verificationError || !verification) {
      return NextResponse.json(
        { message: 'Invalid or expired verification code' },
        { status: 400 }
      )
    }

    // Mark verification as complete
    const { error: updateVerificationError } = await supabaseAdmin
      .from('phone_verifications')
      .update({ verified: true })
      .eq('id', verification.id)

    if (updateVerificationError) {
      console.error('Verification update error:', updateVerificationError)
      return NextResponse.json(
        { message: 'Failed to update verification status' },
        { status: 500 }
      )
    }

    // Update user as verified
    const { data: user, error: userUpdateError } = await supabaseAdmin
      .from('users')
      .update({ 
        phone_verified: true,
        updated_at: new Date().toISOString()
      })
      .eq('phone', formattedPhone)
      .select()
      .single()

    if (userUpdateError) {
      console.error('User update error:', userUpdateError)
      return NextResponse.json(
        { message: 'Failed to update user verification status' },
        { status: 500 }
      )
    }

    // Send welcome message to Aimee system
    try {
      await fetch(`${process.env.NEXTAUTH_URL}/api/aimee/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedPhone,
          name: user.full_name
        })
      })
    } catch (welcomeError) {
      console.error('Welcome message error:', welcomeError)
      // Don't fail verification if welcome message fails
    }

    return NextResponse.json({
      message: 'Phone verified successfully',
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.full_name,
        subscriptionStatus: user.subscription_status,
        trialEndsAt: user.trial_ends_at
      }
    })

  } catch (error) {
    console.error('Phone verification error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 