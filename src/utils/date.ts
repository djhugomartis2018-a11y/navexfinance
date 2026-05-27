import { format, parseISO, startOfMonth, endOfMonth, subMonths, differenceInDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatDate = (date: string | Date, pattern = 'dd/MM/yyyy'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern, { locale: ptBR })
}

export const formatDateRelative = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  const today = new Date()
  const diff = differenceInDays(today, d)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  if (diff < 7) return `${diff} dias atrás`
  return formatDate(d)
}

export const formatMonthYear = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMMM yyyy', { locale: ptBR })
}

export const getCurrentMonthRange = () => {
  const now = new Date()
  return {
    start: format(startOfMonth(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd'),
  }
}

export const getLastNMonths = (n: number) => {
  return Array.from({ length: n }, (_, i) => {
    const date = subMonths(new Date(), n - 1 - i)
    return {
      label: format(date, 'MMM/yy', { locale: ptBR }),
      start: format(startOfMonth(date), 'yyyy-MM-dd'),
      end: format(endOfMonth(date), 'yyyy-MM-dd'),
    }
  })
}

export const daysUntil = (date: string | null): number | null => {
  if (!date) return null
  return differenceInDays(parseISO(date), new Date())
}

export const toISO = (date: Date): string => format(date, 'yyyy-MM-dd')
