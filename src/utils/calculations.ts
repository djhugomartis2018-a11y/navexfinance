import type { Transaction, DashboardSummary, CategorySummary, MonthlyTrend } from '../types/finance.types'
import { getLastNMonths } from './date'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const calcBalance = (income: number, expenses: number): number =>
  income - expenses

export const calcSavingsRate = (income: number, expenses: number): number => {
  if (income === 0) return 0
  return Math.max(0, ((income - expenses) / income) * 100)
}

export const calcGoalProgress = (current: number, target: number): number => {
  if (target === 0) return 0
  return Math.min(100, (current / target) * 100)
}

export const buildDashboardSummary = (
  transactions: Transaction[]
): DashboardSummary => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = calcBalance(income, expenses)
  const savingsRate = calcSavingsRate(income, expenses)

  // top categories
  const categoryMap = new Map<string, { total: number; count: number; category: Transaction['categories'] }>()
  transactions
    .filter((t) => t.type === 'expense' && t.categories)
    .forEach((t) => {
      const key = t.category_id ?? 'uncategorized'
      const existing = categoryMap.get(key)
      if (existing) {
        existing.total += Number(t.amount)
        existing.count++
      } else {
        categoryMap.set(key, { total: Number(t.amount), count: 1, category: t.categories })
      }
    })

  const topCategories: CategorySummary[] = Array.from(categoryMap.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(({ total, count, category }) => ({
      category: category!,
      total,
      count,
      percentage: expenses > 0 ? (total / expenses) * 100 : 0,
    }))

  // monthly trend (last 6 months)
  const months = getLastNMonths(6)
  const monthlyTrend: MonthlyTrend[] = months.map(({ label, start, end }) => {
    const monthTx = transactions.filter(
      (t) => t.transaction_date >= start && t.transaction_date <= end
    )
    const mIncome = monthTx
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + Number(t.amount), 0)
    const mExpenses = monthTx
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + Number(t.amount), 0)
    return { month: label, income: mIncome, expenses: mExpenses, balance: mIncome - mExpenses }
  })

  const recentTransactions = [...transactions]
    .sort((a, b) => b.transaction_date.localeCompare(a.transaction_date))
    .slice(0, 10)

  return {
    totalIncome: income,
    totalExpenses: expenses,
    balance,
    savingsRate,
    transactionCount: transactions.length,
    topCategories,
    recentTransactions,
    monthlyTrend,
  }
}
