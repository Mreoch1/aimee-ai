'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Calendar, 
  Settings, 
  CreditCard, 
  User,
  Phone,
  Clock,
  Star,
  TrendingUp,
  Bell
} from 'lucide-react';

interface Conversation {
  id: number;
  date: string;
  time: string;
  preview: string;
  sentiment: string;
  messageCount: number;
}

interface Memory {
  id: number;
  category: string;
  content: string;
  date: string;
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);

  // Mock data - in real app this would come from API
  useEffect(() => {
    setConversations([
      {
        id: 1,
        date: '2024-01-15',
        time: '2:30 PM',
        preview: 'Had a great day at work today! Aimee helped me process my feelings about the presentation.',
        sentiment: 'positive',
        messageCount: 12
      },
      {
        id: 2,
        date: '2024-01-14',
        time: '8:45 PM',
        preview: 'Feeling anxious about tomorrow. Aimee provided great support and coping strategies.',
        sentiment: 'neutral',
        messageCount: 8
      },
      {
        id: 3,
        date: '2024-01-13',
        time: '12:15 PM',
        preview: 'Celebrated my promotion! Aimee was so excited for me and we planned a celebration.',
        sentiment: 'positive',
        messageCount: 15
      }
    ]);

    setMemories([
      {
        id: 1,
        category: 'Personal',
        content: 'Loves coffee, especially lattes from the local café on Main Street',
        date: '2024-01-10'
      },
      {
        id: 2,
        category: 'Work',
        content: 'Works as a marketing manager, recently got promoted to senior position',
        date: '2024-01-13'
      },
      {
        id: 3,
        category: 'Interests',
        content: 'Enjoys hiking on weekends, favorite trail is the mountain loop near the city',
        date: '2024-01-08'
      },
      {
        id: 4,
        category: 'Relationships',
        content: 'Close with sister Sarah, calls her every Sunday evening',
        date: '2024-01-12'
      }
    ]);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'conversations', label: 'Conversations', icon: MessageCircle },
    { id: 'memories', label: 'Memories', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-pink-500" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Aimee Dashboard
                </h1>
                <p className="text-sm text-gray-600">Your AI friendship journey</p>
              </div>
            </div>
            
                         <div className="flex items-center space-x-4">
               <button 
                 className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                 title="Notifications"
                 aria-label="View notifications"
               >
                 <Bell className="h-5 w-5" />
               </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">Michael</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-xl shadow-sm p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-4 mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Messages</span>
                  <span className="font-semibold text-pink-600">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Active</span>
                  <span className="font-semibold text-pink-600">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Memories Stored</span>
                  <span className="font-semibold text-pink-600">47</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Friendship Level</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-pink-600">Growing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome back!</h2>
                    <p className="text-gray-600 mb-4">
                      Aimee has been thinking about you. Here's what's been happening in your friendship.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageCircle className="h-5 w-5 text-pink-600" />
                          <span className="font-semibold text-pink-800">Recent Chat</span>
                        </div>
                        <p className="text-sm text-pink-700">
                          Last conversation was about your weekend hiking plans
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Heart className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">New Memory</span>
                        </div>
                        <p className="text-sm text-purple-700">
                          Aimee remembered your coffee preference from Main Street café
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-800">Next Check-in</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Aimee will check in about your presentation tomorrow
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Friendship Journey</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-800">Started your friendship with Aimee</p>
                          <p className="text-sm text-gray-600">January 1, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-800">First deep conversation</p>
                          <p className="text-sm text-gray-600">January 3, 2024</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-800">Aimee started remembering personal details</p>
                          <p className="text-sm text-gray-600">January 8, 2024</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'conversations' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Conversation History</h2>
                  <div className="space-y-4">
                    {conversations.map((conv) => (
                      <div key={conv.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{conv.date}</span>
                            <Clock className="h-4 w-4 text-gray-500 ml-2" />
                            <span className="text-sm text-gray-600">{conv.time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              conv.sentiment === 'positive' 
                                ? 'bg-green-100 text-green-800' 
                                : conv.sentiment === 'negative'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {conv.sentiment}
                            </span>
                            <span className="text-sm text-gray-500">{conv.messageCount} messages</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{conv.preview}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'memories' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">What Aimee Remembers About You</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {memories.map((memory) => (
                      <div key={memory.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            memory.category === 'Personal' 
                              ? 'bg-pink-100 text-pink-800'
                              : memory.category === 'Work'
                              ? 'bg-blue-100 text-blue-800'
                              : memory.category === 'Interests'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {memory.category}
                          </span>
                          <span className="text-xs text-gray-500">{memory.date}</span>
                        </div>
                        <p className="text-gray-700">{memory.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Profile Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                                         <input
                               type="text"
                               defaultValue="Michael"
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                               title="Your name"
                               placeholder="Enter your name"
                             />
                           </div>
                           <div>
                             <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                             <input
                               type="email"
                               defaultValue="michael@example.com"
                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                               title="Your email address"
                               placeholder="Enter your email address"
                             />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Communication Preferences</h3>
                        <div className="space-y-3">
                                                     <label className="flex items-center">
                             <input 
                               type="checkbox" 
                               defaultChecked 
                               className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                               title="Daily check-ins from Aimee"
                               aria-label="Enable daily check-ins from Aimee"
                             />
                             <span className="ml-2 text-sm text-gray-700">Daily check-ins from Aimee</span>
                           </label>
                           <label className="flex items-center">
                             <input 
                               type="checkbox" 
                               defaultChecked 
                               className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                               title="Memory updates and insights"
                               aria-label="Enable memory updates and insights"
                             />
                             <span className="ml-2 text-sm text-gray-700">Memory updates and insights</span>
                           </label>
                           <label className="flex items-center">
                             <input 
                               type="checkbox" 
                               className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                               title="Weekly friendship summaries"
                               aria-label="Enable weekly friendship summaries"
                             />
                             <span className="ml-2 text-sm text-gray-700">Weekly friendship summaries</span>
                           </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Subscription</h3>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">Premium Plan</p>
                        <p className="text-sm text-gray-600">Enhanced AI personality and unlimited messages</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">$24.99/month</p>
                        <p className="text-sm text-gray-600">Next billing: Feb 1, 2024</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        Change Plan
                      </button>
                      <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 