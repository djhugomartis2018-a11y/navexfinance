import { supabase, handleSupabaseError } from './supabase.service'
import type {
  Transaction,
  TransactionInsert,
  TransactionUpdate,
  TransactionFilters,
} from '../types/finance.types'

export const transactionService = {
  async getAll(userId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    let query = supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type)
    }
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    if (filters?.date_from) {
      query = query.gte('transaction_date', filters.date_from)
    }
    if (filters?.date_to) {
      query = query.lte('transaction_date', filters.date_to)
    }
    if (filters?.amount_min !== undefined) {
      query = query.gte('amount', filters.amount_min)
    }
    if (filters?.amount_max !== undefined) {
      query = query.lte('amount', filters.amount_max)
    }
    if (filters?.search) {
      query = query.or(
        `description.ilike.%${filters.search}%,merchant.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await query
    if (error) handleSupabaseError(error)
    return (data ?? []) as unknown as Transaction[]
  },

  async getById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('id', id)
      .single()
    if (error) return null
    return data as unknown as Transaction
  },

  async create(payload: TransactionInsert): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(payload as never)
      .select('*, categories(*)')
      .single()
    if (error) handleSupabaseError(error)
    return data as unknown as Transaction
  },

  async update(id: string, payload: TransactionUpdate): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update({ ...payload, updated_at: new Date().toISOString() } as never)
      .eq('id', id)
      .select('*, categories(*)')
      .single()
    if (error) handleSupabaseError(error)
    return data as unknown as Transaction
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) handleSupabaseError(error)
  },

  async getByDateRange(
    userId: string,
    start: string,
    end: string
  ): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, categories(*)')
      .eq('user_id', userId)
      .gte('transaction_date', start)
      .lte('transaction_date', end)
      .order('transaction_date', { ascending: false })
    if (error) handleSupabaseError(error)
    return (data ?? []) as unknown as Transaction[]
  },
}
