export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const truncate = (str: string, max: number): string =>
  str.length > max ? `${str.slice(0, max)}…` : str

export const slugify = (str: string): string =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

export const transactionTypeLabel = (type: 'income' | 'expense'): string =>
  type === 'income' ? 'Receita' : 'Despesa'
