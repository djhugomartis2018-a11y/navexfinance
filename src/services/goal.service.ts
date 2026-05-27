import { supabase, handleSupabaseError } from './supabase.service'
import type { Goal, GoalInsert, GoalUpdate } from '../types/finance.types'
import type { GoalWithProgress } from '../types/goal.types'
import { calcGoalProgress } from '../utils/calculations'
import { daysUntil } from '../utils/date'

export const goalService = {
  async getAll(userId: string): Promise<GoalWithProgress[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) handleSupabaseError(error)
    return (data ?? []).map((g) => enrichGoal(g as unknown as Goal))
  },

  async create(payload: GoalInsert): Promise<GoalWithProgress> {
    const { data, error } = await supabase
      .from('goals')
      .insert(payload as never)
      .select()
      .single()
    if (error) handleSupabaseError(error)
    return enrichGoal(data as unknown as Goal)
  },

  async update(id: string, payload: GoalUpdate): Promise<GoalWithProgress> {
    const { data, error } = await supabase
      .from('goals')
      .update({ ...payload, updated_at: new Date().toISOString() } as never)
      .eq('id', id)
      .select()
      .single()
    if (error) handleSupabaseError(error)
    return enrichGoal(data as unknown as Goal)
  },

  async addFunds(id: string, amount: number, currentAmount: number): Promise<GoalWithProgress> {
    return goalService.update(id, { current_amount: currentAmount + amount })
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('goals').delete().eq('id', id)
    if (error) handleSupabaseError(error)
  },
}

function enrichGoal(goal: Goal): GoalWithProgress {
  return {
    ...goal,
    progressPercentage: calcGoalProgress(goal.current_amount, goal.target_amount),
    remainingAmount: Math.max(0, goal.target_amount - goal.current_amount),
    isCompleted: goal.current_amount >= goal.target_amount,
    daysRemaining: daysUntil(goal.due_date),
  }
}
