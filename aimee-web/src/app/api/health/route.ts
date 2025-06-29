import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      stripe: 'unknown',
      twilio: 'unknown'
    },
    environment: process.env.NODE_ENV || 'development'
  }

  try {
    // Test Supabase connection
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )
      
      const { error } = await supabase
        .from('users')
        .select('count')
        .limit(1)
      
      health.services.database = error ? 'unhealthy' : 'healthy'
    } else {
      health.services.database = 'not_configured'
    }

    // Test Stripe configuration
    health.services.stripe = process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured'
    
    // Test Twilio configuration
    health.services.twilio = (
      process.env.TWILIO_ACCOUNT_SID && 
      process.env.TWILIO_AUTH_TOKEN && 
      process.env.TWILIO_PHONE_NUMBER
    ) ? 'configured' : 'not_configured'

    // Determine overall status
    const allHealthy = Object.values(health.services).every(
      status => status === 'healthy' || status === 'configured'
    )
    
    health.status = allHealthy ? 'healthy' : 'degraded'

    return NextResponse.json(health, { 
      status: health.status === 'healthy' ? 200 : 503 
    })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      ...health,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
} 