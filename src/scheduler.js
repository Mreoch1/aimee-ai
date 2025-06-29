const moment = require('moment');
const { getMemoryContext, getAllUsers, getSpecialDates } = require('./memory');
const { getProactiveMessagePrompt } = require('./ai-prompts');

async function scheduleReminders(type, services) {
  const { twilioClient, supabase } = services;
  
  try {
    const users = await getAllUsers(supabase);
    console.log(`📅 Running ${type} reminders for ${users.length} users`);
    
    for (const userPhone of users) {
      await processUserReminders(userPhone, type, services);
      
      // Add delay between users to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.error(`Error in scheduleReminders (${type}):`, error);
  }
}

async function processUserReminders(userPhone, type, services) {
  const { twilioClient, supabase, openai } = services;
  
  try {
    const memoryContext = await getMemoryContext(supabase, userPhone);
    
    switch (type) {
      case 'morning':
        await sendMorningMessage(userPhone, memoryContext, services);
        break;
        
      case 'evening':
        await sendEveningMessage(userPhone, memoryContext, services);
        break;
        
      case 'birthdays':
        await checkSpecialDates(userPhone, memoryContext, services);
        break;
        
      default:
        console.log(`Unknown reminder type: ${type}`);
    }
    
  } catch (error) {
    console.error(`Error processing reminders for ${userPhone}:`, error);
  }
}

async function sendMorningMessage(userPhone, memoryContext, services) {
  const { twilioClient, openai } = services;
  
  try {
    // Only send morning messages 2-3 times per week randomly
    if (Math.random() > 0.4) {
      return;
    }
    
    const message = await generateProactiveMessage(
      memoryContext,
      'morning',
      openai
    );
    
    if (message) {
      await sendProactiveMessage(userPhone, message, twilioClient);
      console.log(`🌅 Sent morning message to ${userPhone}`);
    }
    
  } catch (error) {
    console.error(`Error sending morning message to ${userPhone}:`, error);
  }
}

async function sendEveningMessage(userPhone, memoryContext, services) {
  const { twilioClient, openai } = services;
  
  try {
    // Only send evening messages 1-2 times per week randomly
    if (Math.random() > 0.3) {
      return;
    }
    
    const message = await generateProactiveMessage(
      memoryContext,
      'evening',
      openai
    );
    
    if (message) {
      await sendProactiveMessage(userPhone, message, twilioClient);
      console.log(`🌆 Sent evening message to ${userPhone}`);
    }
    
  } catch (error) {
    console.error(`Error sending evening message to ${userPhone}:`, error);
  }
}

async function checkSpecialDates(userPhone, memoryContext, services) {
  const { twilioClient, supabase, openai } = services;
  
  try {
    const specialDates = await getSpecialDates(supabase, userPhone);
    const today = moment().format('MM-DD');
    
    for (const dateMemory of specialDates) {
      if (isDateToday(dateMemory.content, today)) {
        const messageType = dateMemory.content.toLowerCase().includes('birthday') 
          ? 'birthday' 
          : 'special_date';
        
        const message = await generateProactiveMessage(
          memoryContext,
          messageType,
          openai
        );
        
        if (message) {
          await sendProactiveMessage(userPhone, message, twilioClient);
          console.log(`🎉 Sent special date message to ${userPhone}: ${dateMemory.content}`);
        }
      }
    }
    
  } catch (error) {
    console.error(`Error checking special dates for ${userPhone}:`, error);
  }
}

function isDateToday(dateContent, today) {
  // Simple date matching - can be enhanced
  const datePatterns = [
    /(\d{1,2})[-\/](\d{1,2})/,  // MM-DD or MM/DD
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i,
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})/i
  ];
  
  for (const pattern of datePatterns) {
    const match = dateContent.match(pattern);
    if (match) {
      let month, day;
      
      if (pattern.toString().includes('january')) {
        // Handle month names
        const monthNames = {
          'january': '01', 'february': '02', 'march': '03', 'april': '04',
          'may': '05', 'june': '06', 'july': '07', 'august': '08',
          'september': '09', 'october': '10', 'november': '11', 'december': '12',
          'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
          'jun': '06', 'jul': '07', 'aug': '08', 'sep': '09',
          'oct': '10', 'nov': '11', 'dec': '12'
        };
        month = monthNames[match[1].toLowerCase()];
        day = match[2].padStart(2, '0');
      } else {
        // Handle MM-DD format
        month = match[1].padStart(2, '0');
        day = match[2].padStart(2, '0');
      }
      
      const dateString = `${month}-${day}`;
      if (dateString === today) {
        return true;
      }
    }
  }
  
  return false;
}

async function generateProactiveMessage(memoryContext, messageType, openai) {
  try {
    const prompt = getProactiveMessagePrompt(memoryContext, messageType);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 200,
      presence_penalty: 0.6
    });
    
    let message = completion.choices[0].message.content.trim();
    
    // Ensure message isn't too long for SMS
    if (message.length > 1500) {
      message = message.substring(0, 1500) + "...";
    }
    
    return message;
    
  } catch (error) {
    console.error('Error generating proactive message:', error);
    return null;
  }
}

async function sendProactiveMessage(userPhone, message, twilioClient) {
  try {
    await twilioClient.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: userPhone,
      body: message
    });
    
    console.log(`📤 Proactive message sent to ${userPhone}: ${message}`);
    
  } catch (error) {
    console.error(`Error sending proactive message to ${userPhone}:`, error);
  }
}

// Function to manually send a message (useful for testing)
async function sendManualMessage(userPhone, message, services) {
  const { twilioClient } = services;
  
  try {
    await sendProactiveMessage(userPhone, message, twilioClient);
    return true;
  } catch (error) {
    console.error('Error sending manual message:', error);
    return false;
  }
}

module.exports = {
  scheduleReminders,
  sendProactiveMessage,
  sendManualMessage,
  generateProactiveMessage
}; 