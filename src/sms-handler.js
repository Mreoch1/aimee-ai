const twilio = require('twilio');
const { getMemoryContext, saveMessage, extractMemories } = require('./memory');
const { getBestFriendPrompt } = require('./ai-prompts');
const aimeeAI = require('./ai-service');

async function handleIncomingSMS(req, res, services) {
  const { twilioClient, aimeeAI, supabase } = services;
  const twiml = new twilio.twiml.MessagingResponse();
  
  try {
    const userPhone = req.body.From;
    const messageBody = req.body.Body;
    const timestamp = new Date().toISOString();
    
    console.log(`📱 Incoming SMS from ${userPhone}: ${messageBody}`);
    
    // Save incoming message
    await saveMessage(supabase, {
      user_phone: userPhone,
      message: messageBody,
      direction: 'incoming',
      timestamp
    });
    
    // Get user's memory context
    const memoryContext = await getMemoryContext(supabase, userPhone);
    
    // Extract any new memories from the message using our AI service
    await extractMemories(supabase, userPhone, messageBody, aimeeAI);
    
    // Generate AI response using our smart AI service
    const aiResponse = await generateBestFriendResponse(
      aimeeAI,
      messageBody,
      memoryContext,
      userPhone
    );
    
    // Save outgoing message
    await saveMessage(supabase, {
      user_phone: userPhone,
      message: aiResponse,
      direction: 'outgoing',
      timestamp: new Date().toISOString()
    });
    
    // Send response via Twilio
    twiml.message(aiResponse);
    
    console.log(`🤖 AI Response to ${userPhone}: ${aiResponse}`);
    
    return twiml.toString();
    
  } catch (error) {
    console.error('Error handling SMS:', error);
    twiml.message('Sorry, I\'m having a moment! Text me again in a sec 💛');
    return twiml.toString();
  }
}

async function generateBestFriendResponse(aimeeAI, userMessage, memoryContext, userPhone) {
  try {
    const systemPrompt = getBestFriendPrompt(memoryContext, userPhone);
    
    const response = await aimeeAI.generateResponse([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ]);
    
    return response;
    
  } catch (error) {
    console.error('Error generating AI response:', error);
    return aimeeAI.getFallbackResponse();
  }
}

module.exports = {
  handleIncomingSMS,
  generateBestFriendResponse
}; 