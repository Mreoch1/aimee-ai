import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string
          full_name: string
          subscription_status: 'active' | 'inactive' | 'canceled' | 'trial'
          subscription_id: string | null
          trial_ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          phone: string
          full_name: string
          subscription_status?: 'active' | 'inactive' | 'canceled' | 'trial'
          subscription_id?: string | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string
          full_name?: string
          subscription_status?: 'active' | 'inactive' | 'canceled' | 'trial'
          subscription_id?: string | null
          trial_ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          user_phone: string
          direction: 'inbound' | 'outbound'
          body: string
          timestamp: string
          message_sid: string | null
        }
        Insert: {
          id?: string
          user_phone: string
          direction: 'inbound' | 'outbound'
          body: string
          timestamp?: string
          message_sid?: string | null
        }
        Update: {
          id?: string
          user_phone?: string
          direction?: 'inbound' | 'outbound'
          body?: string
          timestamp?: string
          message_sid?: string | null
        }
      }
      memories: {
        Row: {
          id: string
          user_phone: string
          content: string
          category: 'personal' | 'preference' | 'date' | 'current_topic' | 'emotion' | 'goal'
          importance: number
          extracted_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_phone: string
          content: string
          category: 'personal' | 'preference' | 'date' | 'current_topic' | 'emotion' | 'goal'
          importance: number
          extracted_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_phone?: string
          content?: string
          category?: 'personal' | 'preference' | 'date' | 'current_topic' | 'emotion' | 'goal'
          importance?: number
          extracted_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      phone_verifications: {
        Row: {
          id: string
          phone: string
          code: string
          verified: boolean
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          code: string
          verified?: boolean
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          code?: string
          verified?: boolean
          expires_at?: string
          created_at?: string
        }
      }
    }
  }
} 