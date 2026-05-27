import { supabase, handleSupabaseError } from './supabase.service'
import type { Category, CategoryInsert, CategoryUpdate } from '../types/finance.types'

export const DEFAULT_CATEGORIES: Omit<CategoryInsert, 'user_id'>[] = [
  { name: 'Alimentação', icon: '🍽️', color: '#f97316', type: 'expense' },
  { name: 'Transporte', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { name: 'Moradia', icon: '🏠', color: '#8b5cf6', type: 'expense' },
  { name: 'Saúde', icon: '❤️', color: '#ef4444', type: 'expense' },
  { name: 'Lazer', icon: '🎮', color: '#ec4899', type: 'expense' },
  { name: 'Educação', icon: '📚', color: '#14b8a6', type: 'expense' },
  { name: 'Roupas', icon: '👕', color: '#f59e0b', type: 'expense' },
  { name: 'Salário', icon: '💰', color: '#22c55e', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#06b6d4', type: 'income' },
  { name: 'Investimentos', icon: '📈', color: '#6366f1', type: 'income' },
]

export const categoryService = {
  async getAll(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name')
    if (error) handleSupabaseError(error)
    return (data ?? []) as unknown as Category[]
  },

  async create(payload: CategoryInsert): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(payload as never)
      .select()
      .single()
    if (error) handleSupabaseError(error)
    return data as unknown as Category
  },

  async update(id: string, payload: CategoryUpdate): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(payload as never)
      .eq('id', id)
      .select()
      .single()
    if (error) handleSupabaseError(error)
    return data as unknown as Category
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) handleSupabaseError(error)
  },

  async seedDefaults(userId: string): Promise<void> {
    const existing = await categoryService.getAll(userId)
    if (existing.length > 0) return
    const toInsert = DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId }))
    const { error } = await supabase.from('categories').insert(toInsert as never)
    if (error) handleSupabaseError(error)
  },
}
