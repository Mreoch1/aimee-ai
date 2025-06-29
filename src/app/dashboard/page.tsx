'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Settings, 
  CreditCard, 
  Calendar,
  Phone,
  Mail,
  User,
  TrendingUp,
  Clock,
  Star,
  Edit3,
  Download,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PRICING_PLANS } from '@/lib/stripe'

interface User {
  id: string
  email: string
  phone: string
  fullName: string
  subscriptionStatus: 'trial' | 'active' | 'inactive' | 'canceled'
  trialEndsAt: string | null
  selectedPlan: string
}

interface Message {
  id: string
  direction: 'inbound' | 'outbound'
  body: string
  timestamp: string
}

interface Memory {
  id: string
  content: string
  category: string
  importance: number
  extractedAt: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // In a real app, you'd check authentication and load user data
      // For now, we'll simulate the data
      setUser({
        id: '1',
        email: 'user@example.com',
        phone: '+1 (555) 123-4567',
        fullName: 'John Doe',
        subscriptionStatus: 'trial',
        trialEndsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        selectedPlan: 'basic'
      })

      setMessages([
        {
          id: '1',
          direction: 'outbound',
          body: 'Hey there! I just signed up and I\'m excited to get to know you!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          direction: 'inbound',
          body: 'Hi! Welcome to Aimee! I\'m so excited to be your new best friend! 💕 Tell me a bit about yourself - what\'s your name and what do you love doing?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString()
        },
        {
          id: '3',
          direction: 'outbound',
          body: 'I\'m John! I love hiking and photography. Just moved to a new city for work.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000).toISOString()
        },
        {
          id: '4',
          direction: 'inbound',
          body: 'Nice to meet you John! 📸 Moving to a new city is such an adventure! I bet there are amazing hiking spots to discover and photograph. How are you feeling about the move?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 90000).toISOString()
        }
      ])

      setMemories([
        {
          id: '1',
          content: 'John loves hiking and photography',
          category: 'personal',
          importance: 8,
          extractedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          content: 'Recently moved to a new city for work',
          category: 'current_topic',
          importance: 9,
          extractedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        }
      ])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'trial': return 'text-blue-600 bg-blue-100'
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-yellow-600 bg-yellow-100'
      case 'canceled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal': return User
      case 'preference': return Star
      case 'date': return Calendar
      case 'current_topic': return MessageCircle
      case 'emotion': return Heart
      case 'goal': return TrendingUp
      default: return MessageCircle
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Aimee
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.fullName}</span>
              <Link 
                href="/settings"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        {user?.subscriptionStatus === 'trial' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Your Free Trial is Active! ✨</h3>
                <p className="text-purple-100">
                  {user.trialEndsAt && `Trial ends ${formatDate(user.trialEndsAt)}`}
                </p>
              </div>
              <Link
                href="/billing"
                className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Upgrade Now
              </Link>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'conversations', label: 'Conversations', icon: MessageCircle },
            { id: 'memories', label: 'Memories', icon: Heart },
            { id: 'billing', label: 'Billing', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{messages.length}</p>
                <p className="text-gray-600 text-sm">Total conversations</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Memories</h3>
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{memories.length}</p>
                <p className="text-gray-600 text-sm">Things Aimee remembers</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Status</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user?.subscriptionStatus || '')}`}>
                    {user?.subscriptionStatus?.toUpperCase()}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {user?.subscriptionStatus === 'trial' ? 'Free trial active' : 'Subscription active'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => window.open(`sms:${user?.phone?.replace(/\D/g, '')}`)}
                    className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-900 font-medium">Text Aimee</span>
                  </button>
                  <Link
                    href="/settings"
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900 font-medium">Settings</span>
                  </Link>
                  <Link
                    href="/billing"
                    className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <span className="text-green-900 font-medium">Billing</span>
                  </Link>
                  <Link
                    href="/support"
                    className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900 font-medium">Support</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'conversations' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Conversations</h3>
                  <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                    Export All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.direction === 'outbound'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.body}</p>
                        <p className={`text-xs mt-1 ${
                          message.direction === 'outbound' ? 'text-purple-100' : 'text-gray-500'
                        }`}>
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <p className="text-gray-500 text-sm mb-4">
                    Text Aimee at <span className="font-semibold">+1 (866) 812-4397</span> to continue your conversation
                  </p>
                  <button
                    onClick={() => window.open(`sms:+18668124397`)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'memories' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">What Aimee Remembers About You</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Aimee automatically remembers important details from your conversations
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {memories.map((memory) => {
                    const IconComponent = getCategoryIcon(memory.category)
                    return (
                      <div key={memory.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <IconComponent className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-gray-900">{memory.content}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-gray-500 capitalize">
                              {memory.category.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(memory.extractedAt)}
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(memory.importance / 2)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {memories.length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No memories yet. Start chatting with Aimee to build memories!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'billing' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Current Plan */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {PRICING_PLANS[user?.selectedPlan as keyof typeof PRICING_PLANS]?.name}
                    </h4>
                    <p className="text-gray-600">
                      {formatCurrency(PRICING_PLANS[user?.selectedPlan as keyof typeof PRICING_PLANS]?.price)}/month
                    </p>
                    {user?.subscriptionStatus === 'trial' && (
                      <p className="text-blue-600 text-sm mt-1">
                        Free trial until {user.trialEndsAt && formatDate(user.trialEndsAt)}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/billing/change-plan"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Change Plan
                  </Link>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No billing history yet</p>
                  <p className="text-gray-400 text-sm">Your first charge will appear after your trial ends</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 