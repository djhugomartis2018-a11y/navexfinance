import { useState, useEffect, useCallback } from 'react'
import { dashboardService } from '../services/dashboard.service'
import { useAuth } from './useAuth'
import type { DashboardSummary } from '../types/finance.types'

export function useDashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await dashboardService.getSummary(user.id)
      setSummary(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar dashboard')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  return { summary, loading, error, refetch: fetch }
}
