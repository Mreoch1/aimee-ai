const OpenAI = require('openai');

/**
 * Smart AI Service for Aimee
 * Switches between Deepseek (testing) and OpenAI (production) for cost optimization
 */

class AimeeAIService {
  constructor() {
    this.mode = process.env.AI_MODE || 'testing'; // 'testing' or 'production'
    
    // Initialize Deepseek client (cost-effective for testing)
    this.deepseekClient = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com'
    });
    
    // Initialize OpenAI client (for production)
    this.openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    console.log(`🤖 Aimee AI initialized in ${this.mode} mode`);
  }
  
  /**
   * Get the appropriate AI client based on current mode
   */
  getClient() {
    return this.mode === 'production' ? this.openaiClient : this.deepseekClient;
  }
  
  /**
   * Get the appropriate model based on current mode
   */
  getModel() {
    if (this.mode === 'production') {
      return 'gpt-4'; // High quality for production
    } else {
      return 'deepseek-chat'; // Cost-effective for testing
    }
  }
  
  /**
   * Generate AI response with automatic fallback
   */
  async generateResponse(messages, options = {}) {
    const client = this.getClient();
    const model = this.getModel();
    
    const defaultOptions = {
      model,
      messages,
      temperature: 0.8,
      max_tokens: 300,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    };
    
    const requestOptions = { ...defaultOptions, ...options };
    
    try {
      console.log(`🧠 Generating response using ${model} in ${this.mode} mode`);
      
      const completion = await client.chat.completions.create(requestOptions);
      
      let response = completion.choices[0].message.content.trim();
      
      // Ensure response isn't too long for SMS
      if (response.length > 1500) {
        response = response.substring(0, 1500) + "...";
      }
      
      // Log cost information
      this.logUsage(completion, model);
      
      return response;
      
    } catch (error) {
      console.error(`❌ Error with ${model}:`, error.message);
      
      // Fallback strategy
      if (this.mode === 'production' && error.message.includes('rate limit')) {
        console.log('🔄 Rate limited on OpenAI, falling back to Deepseek...');
        return await this.generateWithFallback(messages, options);
      }
      
      // Return friendly error message
      return this.getFallbackResponse();
    }
  }
  
  /**
   * Fallback to alternative AI service
   */
  async generateWithFallback(messages, options = {}) {
    try {
      const fallbackOptions = {
        ...options,
        model: 'deepseek-chat',
        messages
      };
      
      const completion = await this.deepseekClient.chat.completions.create(fallbackOptions);
      let response = completion.choices[0].message.content.trim();
      
      if (response.length > 1500) {
        response = response.substring(0, 1500) + "...";
      }
      
      console.log('✅ Fallback response generated successfully');
      return response;
      
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
      return this.getFallbackResponse();
    }
  }
  
  /**
   * Get friendly fallback response when AI fails
   */
  getFallbackResponse() {
    const fallbackMessages = [
      "Hey! I'm having a little tech hiccup. Give me a sec and text me again? 💛",
      "Oops! My brain had a moment there. Try texting me again in a bit! 😊",
      "Sorry! I'm being a bit slow right now. Text me again and I'll be right with you! 🤗"
    ];
    
    return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
  }
  
  /**
   * Log usage for cost monitoring
   */
  logUsage(completion, model) {
    if (completion.usage) {
      const { prompt_tokens, completion_tokens, total_tokens } = completion.usage;
      
      // Estimate costs (approximate)
      let estimatedCost = 0;
      if (model === 'gpt-4') {
        estimatedCost = (prompt_tokens * 0.03 + completion_tokens * 0.06) / 1000;
      } else if (model === 'deepseek-chat') {
        estimatedCost = (total_tokens * 0.0014) / 1000; // Much cheaper!
      }
      
      console.log(`💰 Usage: ${total_tokens} tokens, ~$${estimatedCost.toFixed(4)} (${model})`);
    }
  }
  
  /**
   * Switch between testing and production modes
   */
  switchMode(newMode) {
    if (newMode === 'testing' || newMode === 'production') {
      this.mode = newMode;
      console.log(`🔄 Switched to ${newMode} mode`);
      return true;
    }
    return false;
  }
  
  /**
   * Get current mode and model info
   */
  getStatus() {
    return {
      mode: this.mode,
      model: this.getModel(),
      client: this.mode === 'production' ? 'OpenAI' : 'Deepseek'
    };
  }
  
  /**
   * Extract memories using AI (cost-optimized)
   */
  async extractMemories(messageText) {
    const extractionPrompt = `Analyze this message and extract any important information that a best friend would remember. Look for:

1. Personal details (name, job, relationships, hobbies, etc.)
2. Preferences (likes, dislikes, favorite things)
3. Important dates (birthdays, anniversaries, events)
4. Current situations or concerns
5. Emotional states or feelings
6. Plans or goals they mention

For each piece of information, provide:
- content: The specific detail to remember
- category: One of [personal, preference, date, current_topic, emotion, goal]
- importance: Scale 1-5 (5 being most important to remember)

Only extract information that would be meaningful for a friend to remember. Return as JSON array.

Example format:
[
  {
    "content": "Works as a software engineer at Google",
    "category": "personal",
    "importance": 4
  }
]`;

    try {
      const response = await this.generateResponse([
        { role: "system", content: extractionPrompt },
        { role: "user", content: messageText }
      ], {
        temperature: 0.3,
        max_tokens: 500
      });
      
      // Try to parse as JSON
      try {
        return JSON.parse(response);
      } catch (parseError) {
        console.log('Could not parse memory extraction JSON:', response);
        return [];
      }
      
    } catch (error) {
      console.error('Error extracting memories:', error);
      return [];
    }
  }
}

// Export singleton instance
const aimeeAI = new AimeeAIService();
module.exports = aimeeAI; 