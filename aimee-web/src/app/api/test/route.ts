import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Environment variables:');
    console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('SUPABASE_SERVICE_ROLE_KEY length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
    console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID);

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: 'Missing environment variables',
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }, { status: 500 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Test the connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        error: 'Supabase connection failed',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Connection successful',
      envVars: {
        SUPABASE_URL: !!process.env.SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        TWILIO_ACCOUNT_SID: !!process.env.TWILIO_ACCOUNT_SID,
      }
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 