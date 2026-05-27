import type { Goal } from './finance.types'

export type { Goal }

export interface GoalWithProgress extends Goal {
  progressPercentage: number
  remainingAmount: number
  isCompleted: boolean
  daysRemaining: number | null
}
