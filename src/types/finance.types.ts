import type { Database } from './database.types'

export type Transaction = Database['public']['Tables']['transactions']['Row'] & {
  categories?: Category | null
}
export type TransactionInsert = Database['public']['Tables']['transactions']['Insert']
export type TransactionUpdate = Database['public']['Tables']['transactions']['Update']

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export type Goal = Database['public']['Tables']['goals']['Row']
export type GoalInsert = Database['public']['Tables']['goals']['Insert']
export type GoalUpdate = Database['public']['Tables']['goals']['Update']

export type Subscription = Database['public']['Tables']['subscriptions']['Row'] & {
  categories?: Category | null
}
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

export type Installment = Database['public']['Tables']['installments']['Row'] & {
  categories?: Category | null
}
export type InstallmentInsert = Database['public']['Tables']['installments']['Insert']
export type InstallmentUpdate = Database['public']['Tables']['installments']['Update']

export type Budget = Database['public']['Tables']['budgets']['Row'] & {
  categories?: Category | null
}
export type BudgetInsert = Database['public']['Tables']['budgets']['Insert']
export type BudgetUpdate = Database['public']['Tables']['budgets']['Update']

export type Notification = Database['public']['Tables']['notifications']['Row']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']

export type TransactionType = 'income' | 'expense'
export type CategoryType = 'income' | 'expense' | 'both'

export interface TransactionFilters {
  search?: string
  type?: TransactionType | 'all'
  category_id?: string
  date_from?: string
  date_to?: string
  amount_min?: number
  amount_max?: number
}

export interface DashboardSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  savingsRate: number
  transactionCount: number
  topCategories: CategorySummary[]
  recentTransactions: Transaction[]
  monthlyTrend: MonthlyTrend[]
}

export interface CategorySummary {
  category: Category
  total: number
  percentage: number
  count: number
}

export interface MonthlyTrend {
  month: string
  income: number
  expenses: number
  balance: number
}
