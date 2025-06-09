import { createClient } from "@supabase/supabase-js"

// Use empty strings as fallbacks during build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Only create the client if we have the required values
// This prevents build-time errors
let supabaseClient: ReturnType<typeof createClient> | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

// Export a function that gets or creates the client
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    // If we're in a browser or the client wasn't initialized yet
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error("Supabase URL and anon key are required. Please check your environment variables.")
    }

    supabaseClient = createClient(url, key)
  }
  return supabaseClient
}

// Types for our database
export interface Database {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string
          amount: number
          description: string
          paid_by: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          description: string
          paid_by: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          description?: string
          paid_by?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Expense = Database["public"]["Tables"]["expenses"]["Row"]
export type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"]
export type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"]
