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

// Criar cliente com fallback seguro - não lançar erro se env vars estão ausentes
// Isso permite que o app carregue mesmo sem Supabase configurado
let supabase: ReturnType<typeof createClient<Database>>

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
} else {
  // Fallback: criar um cliente dummy que não vai funcionar, mas não vai lançar erro
  // Isso permite que o app carregue e mostre uma mensagem de erro apropriada
  console.warn(
    '[Supabase] Missing env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY. Using dummy client.'
  )
  
  // Usar valores dummy para não lançar erro
  supabase = createClient<Database>(
    supabaseUrl || 'https://dummy.supabase.co',
    supabaseAnonKey || 'dummy-key',
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    }
  )
}

export { supabase }
export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey)
