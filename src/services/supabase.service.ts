import { supabase } from '../lib/supabase'

export { supabase }

export const handleSupabaseError = (error: unknown): never => {
  const msg = error instanceof Error ? error.message : 'Erro desconhecido'
  console.error('[Supabase]', msg)
  throw new Error(msg)
}
