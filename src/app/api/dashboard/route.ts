import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get conversations
    const { data: conversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get memories
    const { data: memories, error: memoriesError } = await supabase
      .from('memory_entries')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(20);

    // Calculate stats
    const { count: totalMessages } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone);

    const { count: totalMemories } = await supabase
      .from('memory_entries')
      .select('*', { count: 'exact', head: true })
      .eq('phone', phone);

    // Calculate days active
    const { data: firstConversation } = await supabase
      .from('conversations')
      .select('created_at')
      .eq('phone', phone)
      .order('created_at', { ascending: true })
      .limit(1);

    let daysActive = 0;
    if (firstConversation && firstConversation.length > 0) {
      const firstDate = new Date(firstConversation[0].created_at);
      const today = new Date();
      daysActive = Math.floor((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Format conversations for dashboard
    const formattedConversations = conversations?.map(conv => ({
      id: conv.id,
      date: new Date(conv.created_at).toLocaleDateString(),
      time: new Date(conv.created_at).toLocaleTimeString(),
      preview: conv.user_message?.substring(0, 100) + '...' || 'No preview available',
      sentiment: conv.sentiment || 'neutral',
      messageCount: 1 // This would need to be calculated based on your conversation structure
    })) || [];

    // Format memories for dashboard
    const formattedMemories = memories?.map(memory => ({
      id: memory.id,
      category: memory.category || 'General',
      content: memory.content,
      date: new Date(memory.created_at).toLocaleDateString()
    })) || [];

    const dashboardData = {
      user: {
        name: user.name || 'User',
        phone: user.phone,
        plan: user.subscription_tier || 'free',
        createdAt: user.created_at
      },
      conversations: formattedConversations,
      memories: formattedMemories,
      stats: {
        totalMessages: totalMessages || 0,
        daysActive: Math.max(daysActive, 1),
        totalMemories: totalMemories || 0,
        friendshipLevel: totalMessages > 100 ? 'Growing' : totalMessages > 50 ? 'Building' : 'Starting'
      }
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 