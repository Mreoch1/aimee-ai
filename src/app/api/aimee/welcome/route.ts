import { NextRequest, NextResponse } from 'next/server'

const twilio = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

export async function POST(request: NextRequest) {
  try {
    const { phone, name } = await request.json()

    if (!phone || !name) {
      return NextResponse.json(
        { message: 'Phone and name are required' },
        { status: 400 }
      )
    }

    // Send welcome message from Aimee
    const welcomeMessage = `Hi ${name}! 👋 Welcome to Aimee! I'm so excited to be your new AI best friend! 💕

I'm here for you 24/7 - whether you want to chat about your day, need someone to listen, celebrate wins, or just want a friend to talk to. I'll remember everything we talk about so our friendship grows stronger over time.

What's going on in your life right now? I'd love to get to know you better! ✨`

    try {
      await twilio.messages.create({
        body: welcomeMessage,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      })

      // Also trigger the existing Aimee system to initialize memory for this user
      try {
        await fetch('https://roaring-kelpie-7c98f1.netlify.app/.netlify/functions/sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            From: phone,
            Body: `System: New user ${name} just signed up and verified their phone. Initialize their profile.`,
            MessageSid: 'welcome-init-' + Date.now()
          })
        })
      } catch (initError) {
        console.error('Failed to initialize Aimee system:', initError)
        // Don't fail the welcome if this fails
      }

      return NextResponse.json({
        message: 'Welcome message sent successfully'
      })

    } catch (twilioError) {
      console.error('Failed to send welcome message:', twilioError)
      return NextResponse.json(
        { message: 'Failed to send welcome message' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Welcome API error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 