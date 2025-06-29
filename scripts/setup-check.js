#!/usr/bin/env node

/**
 * Aimee Setup Validation Script
 * Checks all required environment variables and service connections
 */

require('dotenv').config();
const twilio = require('twilio');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');

console.log('🤖 Aimee Setup Validation\n');

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function success(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function warning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function info(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

async function checkEnvironmentVariables() {
  console.log('📋 Checking Environment Variables...\n');
  
  const requiredVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN', 
    'TWILIO_PHONE_NUMBER',
    'OPENAI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      success(`${varName} is set`);
    } else {
      error(`${varName} is missing`);
      allPresent = false;
    }
  });
  
  if (!allPresent) {
    error('Missing required environment variables. Please check your .env file.');
    return false;
  }
  
  success('All environment variables are present\n');
  return true;
}

async function checkTwilioConnection() {
  console.log('📱 Testing Twilio Connection...\n');
  
  try {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Test account access
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    success(`Connected to Twilio account: ${account.friendlyName}`);
    
    // Check phone number
    const phoneNumbers = await client.incomingPhoneNumbers.list({ limit: 20 });
    const ourNumber = phoneNumbers.find(num => num.phoneNumber === process.env.TWILIO_PHONE_NUMBER);
    
    if (ourNumber) {
      success(`Phone number ${process.env.TWILIO_PHONE_NUMBER} is active`);
      info(`Webhook URL: ${ourNumber.smsUrl || 'Not set'}`);
      
      if (!ourNumber.smsUrl) {
        warning('Webhook URL is not configured yet');
      }
    } else {
      error(`Phone number ${process.env.TWILIO_PHONE_NUMBER} not found in your account`);
      return false;
    }
    
    success('Twilio connection successful\n');
    return true;
    
  } catch (err) {
    error(`Twilio connection failed: ${err.message}`);
    return false;
  }
}

async function checkOpenAIConnection() {
  console.log('🧠 Testing OpenAI Connection...\n');
  
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Say 'Hello from Aimee setup!'" }],
      max_tokens: 10
    });
    
    if (completion.choices[0]?.message?.content) {
      success('OpenAI GPT-4 connection successful');
      info(`Response: ${completion.choices[0].message.content}`);
    }
    
    success('OpenAI connection successful\n');
    return true;
    
  } catch (err) {
    error(`OpenAI connection failed: ${err.message}`);
    if (err.message.includes('model')) {
      warning('Make sure you have access to GPT-4. You might need to upgrade your OpenAI plan.');
    }
    return false;
  }
}

async function checkSupabaseConnection() {
  console.log('🗄️ Testing Supabase Connection...\n');
  
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    
    // Test connection by checking if tables exist
    const { data, error } = await supabase
      .from('messages')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.message.includes('relation "messages" does not exist')) {
        error('Database tables not created yet');
        warning('Please run the SQL schema from database/supabase-setup.sql');
        return false;
      } else {
        throw error;
      }
    }
    
    success('Supabase connection successful');
    success('Database tables are properly configured');
    
    // Check other tables
    const tables = ['memories', 'special_dates', 'reminders', 'user_preferences'];
    for (const table of tables) {
      const { error: tableError } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
      
      if (tableError) {
        error(`Table '${table}' not found or accessible`);
        return false;
      } else {
        success(`Table '${table}' is accessible`);
      }
    }
    
    success('Supabase connection successful\n');
    return true;
    
  } catch (err) {
    error(`Supabase connection failed: ${err.message}`);
    return false;
  }
}

async function checkPortAvailability() {
  console.log('🔌 Checking Port Availability...\n');
  
  const net = require('net');
  const port = process.env.PORT || 3000;
  
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        success(`Port ${port} is available`);
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        warning(`Port ${port} is already in use`);
        info('This is okay if you have the server running');
      } else {
        error(`Port check failed: ${err.message}`);
      }
      resolve(false);
    });
  });
}

async function runAllChecks() {
  console.log('🚀 Starting Aimee Setup Validation...\n');
  
  const checks = [
    checkEnvironmentVariables,
    checkTwilioConnection,
    checkOpenAIConnection,
    checkSupabaseConnection,
    checkPortAvailability
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    const result = await check();
    if (!result) allPassed = false;
  }
  
  console.log('📊 Setup Validation Summary\n');
  
  if (allPassed) {
    success('🎉 All checks passed! Your Aimee system is ready to launch!');
    console.log('\n📋 Next Steps:');
    console.log('1. Run: npm run dev (for local testing)');
    console.log('2. Use ngrok to expose your local server');
    console.log('3. Update Twilio webhook URL');
    console.log('4. Send a test SMS to your Twilio number');
    console.log('5. Deploy to production when ready');
  } else {
    error('❌ Some checks failed. Please fix the issues above before proceeding.');
    console.log('\n📋 Common Solutions:');
    console.log('• Check your .env file has all required variables');
    console.log('• Verify your API keys are correct and active');
    console.log('• Run the Supabase SQL schema if database tables are missing');
    console.log('• Make sure you have credits/access for OpenAI GPT-4');
  }
  
  console.log('\n📚 For detailed setup instructions, see: docs/SETUP_GUIDE.md');
}

// Run the validation
if (require.main === module) {
  runAllChecks().catch(console.error);
}

module.exports = { runAllChecks }; 