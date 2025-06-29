#!/usr/bin/env node

/**
 * Cost Monitor for Aimee AI
 * Tracks usage and costs for both Deepseek and OpenAI
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Cost estimates (per 1K tokens)
const COSTS = {
  'deepseek-chat': 0.0014,     // Very cost-effective
  'gpt-4': 0.03,               // Input tokens
  'gpt-4-output': 0.06         // Output tokens
};

async function getCostAnalysis(days = 7) {
  try {
    console.log(`📊 AI Usage & Cost Analysis (Last ${days} days)`);
    console.log('=' .repeat(50));
    
    // Get recent messages to estimate usage
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .gte('timestamp', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    
    if (!messages || messages.length === 0) {
      console.log('No messages found in the specified period.');
      return;
    }
    
    // Estimate token usage
    let totalMessages = messages.length;
    let estimatedInputTokens = 0;
    let estimatedOutputTokens = 0;
    
    messages.forEach(msg => {
      // Rough token estimation (1 token ≈ 4 characters)
      if (msg.direction === 'inbound') {
        estimatedInputTokens += Math.ceil(msg.body.length / 4);
      } else {
        estimatedOutputTokens += Math.ceil(msg.body.length / 4);
      }
    });
    
    // Add system prompt tokens (estimated)
    const systemPromptTokens = 500; // Approximate
    estimatedInputTokens += totalMessages * systemPromptTokens;
    
    // Calculate costs for different models
    const deepseekCost = ((estimatedInputTokens + estimatedOutputTokens) / 1000) * COSTS['deepseek-chat'];
    const gpt4Cost = (estimatedInputTokens / 1000) * COSTS['gpt-4'] + (estimatedOutputTokens / 1000) * COSTS['gpt-4-output'];
    
    console.log(`💬 Messages Processed: ${totalMessages}`);
    console.log(`🔤 Estimated Input Tokens: ${estimatedInputTokens.toLocaleString()}`);
    console.log(`🔤 Estimated Output Tokens: ${estimatedOutputTokens.toLocaleString()}`);
    console.log(`🔤 Total Tokens: ${(estimatedInputTokens + estimatedOutputTokens).toLocaleString()}`);
    console.log('');
    
    console.log('💰 COST COMPARISON:');
    console.log(`Deepseek (Testing): $${deepseekCost.toFixed(4)}`);
    console.log(`GPT-4 (Production): $${gpt4Cost.toFixed(4)}`);
    console.log(`Savings with Deepseek: $${(gpt4Cost - deepseekCost).toFixed(4)} (${(((gpt4Cost - deepseekCost) / gpt4Cost) * 100).toFixed(1)}%)`);
    console.log('');
    
    // Monthly projection
    const dailyAverage = totalMessages / days;
    const monthlyMessages = dailyAverage * 30;
    const monthlyDeepseekCost = (deepseekCost / totalMessages) * monthlyMessages;
    const monthlyGpt4Cost = (gpt4Cost / totalMessages) * monthlyMessages;
    
    console.log('📅 MONTHLY PROJECTION:');
    console.log(`Messages per day: ${dailyAverage.toFixed(1)}`);
    console.log(`Monthly messages: ${monthlyMessages.toFixed(0)}`);
    console.log(`Monthly cost (Deepseek): $${monthlyDeepseekCost.toFixed(2)}`);
    console.log(`Monthly cost (GPT-4): $${monthlyGpt4Cost.toFixed(2)}`);
    console.log(`Monthly savings: $${(monthlyGpt4Cost - monthlyDeepseekCost).toFixed(2)}`);
    console.log('');
    
    // Recommendations
    console.log('💡 RECOMMENDATIONS:');
    if (monthlyDeepseekCost < 5) {
      console.log('✅ Deepseek is very cost-effective for your usage level');
    } else if (monthlyDeepseekCost < 20) {
      console.log('⚖️ Consider hybrid approach: Deepseek for testing, GPT-4 for production');
    } else {
      console.log('🎯 Monitor usage closely and optimize prompts for efficiency');
    }
    
    // Usage patterns
    const messagesByHour = {};
    messages.forEach(msg => {
      const hour = new Date(msg.timestamp).getHours();
      messagesByHour[hour] = (messagesByHour[hour] || 0) + 1;
    });
    
    const peakHour = Object.keys(messagesByHour).reduce((a, b) => 
      messagesByHour[a] > messagesByHour[b] ? a : b
    );
    
    console.log(`📈 Peak usage hour: ${peakHour}:00 (${messagesByHour[peakHour]} messages)`);
    
  } catch (error) {
    console.error('Error analyzing costs:', error);
  }
}

async function switchAIMode(mode) {
  if (mode !== 'testing' && mode !== 'production') {
    console.error('❌ Invalid mode. Use "testing" or "production"');
    return;
  }
  
  try {
    // This would need to be implemented with your deployment system
    console.log(`🔄 Switching to ${mode} mode...`);
    console.log('💡 Update your environment variable AI_MODE and redeploy');
    console.log(`   netlify env:set AI_MODE "${mode}"`);
    console.log('   netlify deploy --prod');
  } catch (error) {
    console.error('Error switching mode:', error);
  }
}

// CLI interface
const command = process.argv[2];
const param = process.argv[3];

switch (command) {
  case 'analyze':
    const days = param ? parseInt(param) : 7;
    getCostAnalysis(days);
    break;
    
  case 'switch':
    if (!param) {
      console.error('Usage: node cost-monitor.js switch [testing|production]');
      process.exit(1);
    }
    switchAIMode(param);
    break;
    
  default:
    console.log('Aimee AI Cost Monitor');
    console.log('');
    console.log('Usage:');
    console.log('  node cost-monitor.js analyze [days]     - Analyze costs for last N days (default: 7)');
    console.log('  node cost-monitor.js switch [mode]      - Switch between testing/production mode');
    console.log('');
    console.log('Examples:');
    console.log('  node cost-monitor.js analyze 30         - Analyze last 30 days');
    console.log('  node cost-monitor.js switch production  - Switch to production mode');
} 