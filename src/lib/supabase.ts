import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

// Vite expõe variáveis via import.meta.env
// Para o TypeScript reconhecer, declaramos o tipo abaixo
declare global {
  interface ImportMeta {
    readonly env: Record<string, string>
  }
}

const supabaseUrl = (import.meta as ImportMeta).env['VITE_SUPABASE_URL']
const supabaseAnonKey = (import.meta as ImportMeta).env['VITE_SUPABASE_ANON_KEY']

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})
