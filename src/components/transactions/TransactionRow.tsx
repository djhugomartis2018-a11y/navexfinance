import React from 'react'
import type { Transaction } from '../../types/finance.types'
import { formatCurrency } from '../../utils/currency'
import { formatDateRelative } from '../../utils/date'

interface TransactionRowProps {
  transaction: Transaction
  onEdit: (t: Transaction) => void
  onDelete: (id: string) => void
}

export function TransactionRow({ transaction: t, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = t.type === 'income'
  const category = t.categories

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 20px', borderRadius: 12,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: 8, transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
    >
      {/* Category icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: category?.color ? `${category.color}22` : 'rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20,
      }}>
        {category?.icon ?? (isIncome ? '💰' : '💸')}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 500, color: '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {t.description}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
          {category?.name ?? 'Sem categoria'}
          {t.merchant ? ` · ${t.merchant}` : ''}
          {t.is_subscription ? ' · 🔄 Assinatura' : ''}
        </p>
      </div>

      {/* Date */}
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
        {formatDateRelative(t.transaction_date)}
      </span>

      {/* Amount */}
      <span style={{
        fontSize: 15, fontWeight: 600, flexShrink: 0, minWidth: 100, textAlign: 'right',
        color: isIncome ? '#4ade80' : '#f87171',
      }}>
        {isIncome ? '+' : '-'} {formatCurrency(Number(t.amount))}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onEdit(t)}
          style={{
            width: 30, height: 30, borderRadius: 8, border: 'none',
            background: 'rgba(99,102,241,0.15)', color: '#a5b4fc',
            cursor: 'pointer', fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
          title="Editar"
        >✏</button>
        <button
          onClick={() => {
            if (confirm('Excluir esta transação?')) onDelete(t.id)
          }}
          style={{
            width: 30, height: 30, borderRadius: 8, border: 'none',
            background: 'rgba(239,68,68,0.15)', color: '#f87171',
            cursor: 'pointer', fontSize: 14, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}
          title="Excluir"
        >🗑</button>
      </div>
    </div>
  )
}
