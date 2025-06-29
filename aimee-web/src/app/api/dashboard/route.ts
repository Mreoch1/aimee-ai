import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get conversations
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_phone', phone)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get memories
    const { data: memories, error: memError } = await supabase
      .from('memories')
      .select('*')
      .eq('user_phone', phone)
      .order('created_at', { ascending: false })
      .limit(20);

    // Get usage stats for free tier users
    let messagesUsed = 0;
    if (user.subscription_tier === 'free') {
      const { data: usage } = await supabase
        .from('usage_tracking')
        .select('messages_used')
        .eq('user_phone', phone)
        .gte('period_start', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .single();
      
      messagesUsed = usage?.messages_used || 0;
    }

    // Calculate stats
    const totalMessages = conversations?.reduce((sum, conv) => sum + (conv.message_count || 0), 0) || 0;
    const daysActive = user.created_at 
      ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 1;
    const totalMemories = memories?.length || 0;
    
    // Determine friendship level
    let friendshipLevel = 'Getting Started';
    if (totalMessages > 100) friendshipLevel = 'Close Friends';
    else if (totalMessages > 50) friendshipLevel = 'Good Friends';
    else if (totalMessages > 20) friendshipLevel = 'Building Trust';
    else if (totalMessages > 5) friendshipLevel = 'Getting Acquainted';

    // Format conversations for frontend
    const formattedConversations = conversations?.map(conv => ({
      id: conv.id,
      date: new Date(conv.created_at).toLocaleDateString(),
      time: new Date(conv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      preview: conv.last_message || 'Conversation started',
      sentiment: conv.sentiment || 'neutral',
      messageCount: conv.message_count || 1
    })) || [];

    // Format memories for frontend
    const formattedMemories = memories?.map(memory => ({
      id: memory.id,
      category: memory.category || 'Personal',
      content: memory.content,
      date: new Date(memory.created_at).toLocaleDateString()
    })) || [];

    const dashboardData = {
      user: {
        name: user.name,
        phone: user.phone,
        plan: user.subscription_tier,
        createdAt: user.created_at,
        subscription_tier: user.subscription_tier,
        subscription_status: user.subscription_status,
        subscription_current_period_end: user.subscription_current_period_end,
        messages_used: messagesUsed
      },
      conversations: formattedConversations,
      memories: formattedMemories,
      stats: {
        totalMessages,
        daysActive,
        totalMemories,
        friendshipLevel,
        messages_used: messagesUsed
      }
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ 
      error: 'Failed to load dashboard data' 
    }, { status: 500 });
  }
} 