export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          email: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          email?: string | null
          created_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          description: string
          amount: number
          type: 'income' | 'expense'
          category_id: string | null
          merchant: string | null
          transaction_date: string
          notes: string | null
          is_subscription: boolean
          installment_group_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description: string
          amount: number
          type: 'income' | 'expense'
          category_id?: string | null
          merchant?: string | null
          transaction_date?: string
          notes?: string | null
          is_subscription?: boolean
          installment_group_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string
          amount?: number
          type?: 'income' | 'expense'
          category_id?: string | null
          merchant?: string | null
          transaction_date?: string
          notes?: string | null
          is_subscription?: boolean
          installment_group_id?: string | null
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          icon: string | null
          color: string
          type: 'income' | 'expense' | 'both'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          icon?: string | null
          color?: string
          type?: 'income' | 'expense' | 'both'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          icon?: string | null
          color?: string
          type?: 'income' | 'expense' | 'both'
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          target_amount: number
          current_amount: number
          due_date: string | null
          color: string
          icon: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          target_amount: number
          current_amount?: number
          due_date?: string | null
          color?: string
          icon?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          target_amount?: number
          current_amount?: number
          due_date?: string | null
          color?: string
          icon?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          merchant: string
          description: string | null
          amount: number
          billing_day: number | null
          active: boolean
          category_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          merchant: string
          description?: string | null
          amount: number
          billing_day?: number | null
          active?: boolean
          category_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          merchant?: string
          description?: string | null
          amount?: number
          billing_day?: number | null
          active?: boolean
          category_id?: string | null
        }
      }
      installments: {
        Row: {
          id: string
          user_id: string
          merchant: string
          description: string | null
          total_installments: number
          current_installment: number
          total_amount: number
          installment_amount: number
          start_date: string
          category_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          merchant: string
          description?: string | null
          total_installments: number
          current_installment?: number
          total_amount: number
          installment_amount: number
          start_date?: string
          category_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          merchant?: string
          description?: string | null
          total_installments?: number
          current_installment?: number
          total_amount?: number
          installment_amount?: number
          start_date?: string
          category_id?: string | null
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          limit_amount: number
          period: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          limit_amount: number
          period?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          limit_amount?: number
          period?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string | null
          read: boolean
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body?: string | null
          read?: boolean
          type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string | null
          read?: boolean
          type?: string
        }
      }
      user_data: {
        Row: {
          id: string
          data: Json
          updated_at: string | null
        }
        Insert: {
          id: string
          data: Json
          updated_at?: string | null
        }
        Update: {
          id?: string
          data?: Json
          updated_at?: string | null
        }
      }
    }
  }
}
