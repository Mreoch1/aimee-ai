const { getMemoryExtractionPrompt } = require('./ai-prompts');

async function saveMessage(supabase, messageData) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData]);
    
    if (error) {
      console.error('Error saving message:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveMessage:', error);
    return null;
  }
}

async function getMemoryContext(supabase, userPhone) {
  try {
    // Get recent memories for this user
    const { data: memories, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_phone', userPhone)
      .order('importance', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error fetching memories:', error);
      return [];
    }
    
    return memories || [];
  } catch (error) {
    console.error('Error in getMemoryContext:', error);
    return [];
  }
}

async function saveMemory(supabase, memoryData) {
  try {
    // Check if similar memory already exists
    const { data: existing, error: searchError } = await supabase
      .from('memories')
      .select('*')
      .eq('user_phone', memoryData.user_phone)
      .eq('category', memoryData.category)
      .ilike('content', `%${memoryData.content.substring(0, 20)}%`);
    
    if (searchError) {
      console.error('Error searching existing memories:', searchError);
    }
    
    // If similar memory exists, update it instead of creating duplicate
    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from('memories')
        .update({
          content: memoryData.content,
          importance: Math.max(existing[0].importance, memoryData.importance),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing[0].id);
      
      if (error) {
        console.error('Error updating memory:', error);
      }
      return data;
    }
    
    // Create new memory
    const { data, error } = await supabase
      .from('memories')
      .insert([{
        ...memoryData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);
    
    if (error) {
      console.error('Error saving memory:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in saveMemory:', error);
    return null;
  }
}

async function extractMemories(supabase, userPhone, message, aimeeAI) {
  try {
    const extractedMemories = await aimeeAI.extractMemories(message);
    
    // Save each extracted memory
    if (Array.isArray(extractedMemories)) {
      for (const memory of extractedMemories) {
        if (memory.content && memory.category && memory.importance >= 3) {
          await saveMemory(supabase, {
            user_phone: userPhone,
            content: memory.content,
            category: memory.category,
            importance: memory.importance
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error extracting memories:', error);
  }
}

async function getRecentMessages(supabase, userPhone, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_phone', userPhone)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching recent messages:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getRecentMessages:', error);
    return [];
  }
}

async function getSpecialDates(supabase, userPhone) {
  try {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('user_phone', userPhone)
      .eq('category', 'date')
      .order('importance', { ascending: false });
    
    if (error) {
      console.error('Error fetching special dates:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getSpecialDates:', error);
    return [];
  }
}

async function getAllUsers(supabase) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('user_phone')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    // Get unique phone numbers
    const uniqueUsers = [...new Set(data.map(msg => msg.user_phone))];
    return uniqueUsers;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
}

module.exports = {
  saveMessage,
  getMemoryContext,
  saveMemory,
  extractMemories,
  getRecentMessages,
  getSpecialDates,
  getAllUsers
}; 