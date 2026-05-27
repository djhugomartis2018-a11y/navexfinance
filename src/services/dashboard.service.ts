import { transactionService } from './transaction.service'
import { buildDashboardSummary } from '../utils/calculations'
import { getCurrentMonthRange } from '../utils/date'
import type { DashboardSummary } from '../types/finance.types'

export const dashboardService = {
  async getSummary(userId: string): Promise<DashboardSummary> {
    const { start, end } = getCurrentMonthRange()
    const transactions = await transactionService.getByDateRange(userId, start, end)
    return buildDashboardSummary(transactions)
  },

  async getSummaryForPeriod(userId: string, start: string, end: string): Promise<DashboardSummary> {
    const transactions = await transactionService.getByDateRange(userId, start, end)
    return buildDashboardSummary(transactions)
  },
}
