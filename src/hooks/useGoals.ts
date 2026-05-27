import { useState, useEffect, useCallback } from 'react'
import { goalService } from '../services/goal.service'
import { useAuth } from './useAuth'
import type { GoalInsert, GoalUpdate } from '../types/finance.types'
import type { GoalWithProgress } from '../types/goal.types'

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<GoalWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await goalService.getAll(user.id)
      setGoals(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar metas')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const create = useCallback(
    async (payload: Omit<GoalInsert, 'user_id'>): Promise<GoalWithProgress> => {
      if (!user) throw new Error('Not authenticated')
      const created = await goalService.create({ ...payload, user_id: user.id })
      setGoals((prev) => [created, ...prev])
      return created
    },
    [user]
  )

  const update = useCallback(async (id: string, payload: GoalUpdate): Promise<GoalWithProgress> => {
    const updated = await goalService.update(id, payload)
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
    return updated
  }, [])

  const addFunds = useCallback(async (id: string, amount: number): Promise<GoalWithProgress> => {
    const goal = goals.find((g) => g.id === id)
    if (!goal) throw new Error('Meta não encontrada')
    const updated = await goalService.addFunds(id, amount, goal.current_amount)
    setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
    return updated
  }, [goals])

  const remove = useCallback(async (id: string): Promise<void> => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    try {
      await goalService.delete(id)
    } catch (e) {
      fetch()
      throw e
    }
  }, [fetch])

  return { goals, loading, error, refetch: fetch, create, update, addFunds, remove }
}
