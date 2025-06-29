const { handleIncomingSMS } = require('../../src/sms-handler');
const twilio = require('twilio');
const { createClient } = require('@supabase/supabase-js');
const aimeeAI = require('../../src/ai-service');

// Initialize services
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data from Twilio
    const params = new URLSearchParams(event.body);
    const req = {
      body: {
        From: params.get('From'),
        To: params.get('To'),
        Body: params.get('Body'),
        MessageSid: params.get('MessageSid')
      }
    };

    // Create a mock response object
    const res = {
      type: () => res,
      send: (data) => data
    };

    // Handle the SMS with timeout protection
    const twimlResponse = await Promise.race([
      handleIncomingSMS(req, res, {
        twilioClient,
        aimeeAI,
        supabase
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Function timeout')), 8000)
      )
    ]);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/xml'
      },
      body: twimlResponse
    };

  } catch (error) {
    console.error('Netlify function error:', error);
    
    // Return a basic TwiML error response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, I\'m having trouble right now. Try texting me again in a moment! 💛');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/xml'
      },
      body: twiml.toString()
    };
  }
}; 