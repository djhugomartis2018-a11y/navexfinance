import React, { useState, useEffect } from 'react'
import type { Transaction, TransactionInsert, TransactionUpdate, Category } from '../../types/finance.types'
import { formatCurrency } from '../../utils/currency'
import { toISO } from '../../utils/date'

interface TransactionFormProps {
  transaction?: Transaction | null
  categories: Category[]
  onSubmit: (data: Omit<TransactionInsert, 'user_id'> | TransactionUpdate) => Promise<void>
  onCancel: () => void
  defaultType?: 'income' | 'expense'
}

const FIELD = (label: string, children: React.ReactNode) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 500,
      color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase',
      letterSpacing: '0.05em' }}>
      {label}
    </label>
    {children}
  </div>
)

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
}

export function TransactionForm({
  transaction, categories, onSubmit, onCancel, defaultType = 'expense'
}: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    description: transaction?.description ?? '',
    amount: transaction?.amount ? String(transaction.amount) : '',
    type: transaction?.type ?? defaultType,
    category_id: transaction?.category_id ?? '',
    merchant: transaction?.merchant ?? '',
    transaction_date: transaction?.transaction_date ?? toISO(new Date()),
    notes: transaction?.notes ?? '',
    is_subscription: transaction?.is_subscription ?? false,
  })

  const set = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.description.trim()) return setError('Descrição obrigatória')
    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) return setError('Valor inválido')

    setLoading(true)
    try {
      await onSubmit({
        description: form.description.trim(),
        amount,
        type: form.type as 'income' | 'expense',
        category_id: form.category_id || null,
        merchant: form.merchant.trim() || null,
        transaction_date: form.transaction_date,
        notes: form.notes.trim() || null,
        is_subscription: form.is_subscription,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(
    (c) => c.type === 'both' || c.type === form.type
  )

  return (
    <form onSubmit={handleSubmit}>
      {/* Type toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t} type="button"
            onClick={() => set('type', t)}
            style={{
              flex: 1, padding: '10px', borderRadius: 10, border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 500,
              background: form.type === t
                ? (t === 'income' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)')
                : 'rgba(255,255,255,0.06)',
              color: form.type === t
                ? (t === 'income' ? '#4ade80' : '#f87171')
                : 'rgba(255,255,255,0.5)',
              transition: 'all 0.15s',
            }}
          >
            {t === 'income' ? '➕ Receita' : '➖ Despesa'}
          </button>
        ))}
      </div>

      {FIELD('Descrição', (
        <input
          style={inputStyle} value={form.description} required
          placeholder="Ex: Supermercado, Salário..."
          onChange={(e) => set('description', e.target.value)}
        />
      ))}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {FIELD('Valor (R$)', (
          <input
            style={inputStyle} value={form.amount} required
            placeholder="0,00" type="text" inputMode="decimal"
            onChange={(e) => set('amount', e.target.value)}
          />
        ))}
        {FIELD('Data', (
          <input
            style={inputStyle} type="date" value={form.transaction_date}
            onChange={(e) => set('transaction_date', e.target.value)}
          />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {FIELD('Categoria', (
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={form.category_id}
            onChange={(e) => set('category_id', e.target.value)}
          >
            <option value="">Sem categoria</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        ))}
        {FIELD('Estabelecimento', (
          <input
            style={inputStyle} value={form.merchant}
            placeholder="Ex: iFood, Netflix..."
            onChange={(e) => set('merchant', e.target.value)}
          />
        ))}
      </div>

      {FIELD('Observações', (
        <textarea
          style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }}
          value={form.notes} placeholder="Notas opcionais..."
          onChange={(e) => set('notes', e.target.value)}
        />
      ))}

      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 24 }}>
        <input
          type="checkbox" checked={form.is_subscription}
          onChange={(e) => set('is_subscription', e.target.checked)}
          style={{ width: 16, height: 16, accentColor: '#6366f1' }}
        />
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Assinatura recorrente</span>
      </label>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 10, padding: '10px 14px', marginBottom: 16,
          fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={onCancel}
          style={{ flex: 1, padding: '12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}>
          Cancelar
        </button>
        <button type="submit" disabled={loading}
          style={{ flex: 2, padding: '12px', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: '#fff', fontSize: 14,
            fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Salvando...' : transaction ? 'Salvar alterações' : 'Adicionar transação'}
        </button>
      </div>
    </form>
  )
}
