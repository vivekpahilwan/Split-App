import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
