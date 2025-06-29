#!/usr/bin/env node

/**
 * SMS Testing Script for Aimee
 * Allows manual testing of SMS functionality
 */

require('dotenv').config({ path: '.env.local' });
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendTestMessage(to, message) {
  try {
    console.log(`📱 Sending test message to ${to}...`);
    console.log(`💬 Message: "${message}"`);
    
    const result = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
      body: message
    });
    
    console.log(`✅ Message sent successfully!`);
    console.log(`📋 Message SID: ${result.sid}`);
    console.log(`💰 Cost: $${result.price || 'TBD'}`);
    
    return result;
    
  } catch (error) {
    console.error(`❌ Failed to send message: ${error.message}`);
    return null;
  }
}

async function testProactiveMessage() {
  const testNumber = process.argv[2];
  
  if (!testNumber) {
    console.log('📞 Usage: node scripts/test-sms.js +1234567890');
    console.log('📞 Example: node scripts/test-sms.js +15551234567');
    return;
  }
  
  const testMessages = [
    "Hey! This is a test message from Aimee 🤖",
    "Good morning! Hope you're having a great day! ☀️",
    "Just checking in - how are things going? 💛"
  ];
  
  const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
  
  await sendTestMessage(testNumber, randomMessage);
}

async function simulateConversation() {
  const testNumber = process.argv[2];
  
  if (!testNumber) {
    console.log('📞 Usage: node scripts/test-sms.js +1234567890 --conversation');
    return;
  }
  
  const conversationFlow = [
    "Hi! I'm testing Aimee's conversation flow 🤖",
    "My name is Test User and I work at OpenAI",
    "My birthday is December 25th",
    "I love pizza and hate mornings 😴",
    "What do you remember about me?"
  ];
  
  console.log('🎭 Starting simulated conversation...\n');
  
  for (let i = 0; i < conversationFlow.length; i++) {
    await sendTestMessage(testNumber, conversationFlow[i]);
    
    if (i < conversationFlow.length - 1) {
      console.log('⏳ Waiting 3 seconds before next message...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('✅ Conversation simulation complete!');
}

async function checkMessageHistory() {
  try {
    console.log('📋 Fetching recent messages...');
    
    const messages = await client.messages.list({ limit: 10 });
    
    console.log(`\n📊 Found ${messages.length} recent messages:\n`);
    
    messages.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg.direction.toUpperCase()}`);
      console.log(`   From: ${msg.from}`);
      console.log(`   To: ${msg.to}`);
      console.log(`   Body: ${msg.body}`);
      console.log(`   Status: ${msg.status}`);
      console.log(`   Date: ${msg.dateCreated}`);
      console.log('');
    });
    
  } catch (error) {
    console.error(`❌ Failed to fetch messages: ${error.message}`);
  }
}

// Main execution
async function main() {
  const command = process.argv[3];
  
  console.log('🤖 Aimee SMS Testing Tool\n');
  
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.error('❌ Missing Twilio credentials. Please check your .env file.');
    return;
  }
  
  switch (command) {
    case '--conversation':
      await simulateConversation();
      break;
    case '--history':
      await checkMessageHistory();
      break;
    default:
      await testProactiveMessage();
  }
}

if (require.main === module) {
  main().catch(console.error);
} 