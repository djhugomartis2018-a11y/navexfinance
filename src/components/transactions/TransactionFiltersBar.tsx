import React from 'react'
import type { TransactionFilters, Category } from '../../types/finance.types'

interface FiltersBarProps {
  filters: TransactionFilters
  categories: Category[]
  onChange: (filters: TransactionFilters) => void
  onReset: () => void
}

const inputStyle: React.CSSProperties = {
  padding: '8px 12px', borderRadius: 10,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 13, outline: 'none',
}

export function TransactionFiltersBar({ filters, categories, onChange, onReset }: FiltersBarProps) {
  const set = (key: keyof TransactionFilters, value: unknown) =>
    onChange({ ...filters, [key]: value || undefined })

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
      padding: '16px 20px', background: 'rgba(255,255,255,0.03)',
      borderRadius: 14, border: '1px solid rgba(255,255,255,0.07)',
      marginBottom: 20,
    }}>
      {/* Search */}
      <input
        style={{ ...inputStyle, flex: '1 1 200px', minWidth: 160 }}
        placeholder="🔍  Buscar transação..."
        value={filters.search ?? ''}
        onChange={(e) => set('search', e.target.value)}
      />

      {/* Type */}
      <select
        style={{ ...inputStyle, cursor: 'pointer' }}
        value={filters.type ?? 'all'}
        onChange={(e) => set('type', e.target.value === 'all' ? undefined : e.target.value)}
      >
        <option value="all">Todos os tipos</option>
        <option value="income">Receitas</option>
        <option value="expense">Despesas</option>
      </select>

      {/* Category */}
      <select
        style={{ ...inputStyle, cursor: 'pointer' }}
        value={filters.category_id ?? ''}
        onChange={(e) => set('category_id', e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
        ))}
      </select>

      {/* Date range */}
      <input
        type="date" style={inputStyle}
        value={filters.date_from ?? ''}
        onChange={(e) => set('date_from', e.target.value)}
      />
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>até</span>
      <input
        type="date" style={inputStyle}
        value={filters.date_to ?? ''}
        onChange={(e) => set('date_to', e.target.value)}
      />

      {/* Reset */}
      <button
        onClick={onReset}
        style={{
          padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
          background: 'transparent', color: 'rgba(255,255,255,0.4)',
          fontSize: 13, cursor: 'pointer',
        }}
      >
        Limpar
      </button>
    </div>
  )
}
