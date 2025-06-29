require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 3000;

// Initialize services
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Import modules
const { handleIncomingSMS } = require('./src/sms-handler');
const { scheduleReminders, sendProactiveMessage } = require('./src/scheduler');
const { getMemoryContext, saveMessage, saveMemory } = require('./src/memory');

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Aimee - Best Friend AI SMS System',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Main SMS webhook endpoint
app.post('/sms', async (req, res) => {
  try {
    const response = await handleIncomingSMS(req, res, {
      twilioClient,
      openai,
      supabase
    });
    res.type('text/xml').send(response);
  } catch (error) {
    console.error('SMS handling error:', error);
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, I\'m having trouble right now. Try texting me again in a moment! 💛');
    res.type('text/xml').send(twiml.toString());
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      twilio: !!process.env.TWILIO_ACCOUNT_SID,
      openai: !!process.env.OPENAI_API_KEY,
      supabase: !!process.env.SUPABASE_URL
    }
  });
});

// Schedule proactive messages
// Morning check-ins at 9 AM
cron.schedule('0 9 * * *', async () => {
  console.log('Running morning check-ins...');
  await scheduleReminders('morning', { twilioClient, supabase });
});

// Evening reminders at 7 PM
cron.schedule('0 19 * * *', async () => {
  console.log('Running evening reminders...');
  await scheduleReminders('evening', { twilioClient, supabase });
});

// Birthday checks at 8 AM
cron.schedule('0 8 * * *', async () => {
  console.log('Checking for birthdays and special dates...');
  await scheduleReminders('birthdays', { twilioClient, supabase });
});

// Start server
app.listen(port, () => {
  console.log(`🤖 Aimee Best Friend AI SMS System running on port ${port}`);
  console.log(`📱 Twilio webhook URL: ${process.env.WEBHOOK_URL || `http://localhost:${port}/sms`}`);
  console.log(`🕘 Scheduled tasks initialized`);
});

module.exports = app; 