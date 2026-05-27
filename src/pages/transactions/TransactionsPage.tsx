import React, { useState, useCallback } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useAppContext } from '../../context/AppContext'
import { TransactionRow } from '../../components/transactions/TransactionRow'
import { TransactionForm } from '../../components/transactions/TransactionForm'
import { TransactionFiltersBar } from '../../components/transactions/TransactionFiltersBar'
import { Modal } from '../../components/common/Modal'
import { EmptyState } from '../../components/common/EmptyState'
import { TransactionRowSkeleton } from '../../components/common/Skeleton'
import { formatCurrency } from '../../utils/currency'
import type { Transaction, TransactionFilters, TransactionInsert, TransactionUpdate } from '../../types/finance.types'

const EMPTY_FILTERS: TransactionFilters = {}

export default function TransactionsPage() {
  const { state } = useAppContext()
  const { transactions, loading, error, filters, setFilters, create, update, remove } =
    useTransactions()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [defaultType, setDefaultType] = useState<'income' | 'expense'>('expense')

  const categories = state.categories

  const openCreate = (type: 'income' | 'expense' = 'expense') => {
    setEditingTx(null)
    setDefaultType(type)
    setModalOpen(true)
  }

  const openEdit = (tx: Transaction) => {
    setEditingTx(tx)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingTx(null)
  }

  const handleSubmit = useCallback(
    async (data: Omit<TransactionInsert, 'user_id'> | TransactionUpdate) => {
      if (editingTx) {
        await update(editingTx.id, data as TransactionUpdate)
      } else {
        await create(data as Omit<TransactionInsert, 'user_id'>)
      }
      closeModal()
    },
    [editingTx, create, update]
  )

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount), 0)
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Number(t.amount), 0)
  const balance = totalIncome - totalExpenses

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#fff' }}>
            Transações
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            {transactions.length} transaç{transactions.length !== 1 ? 'ões' : 'ão'} encontrada{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => openCreate('income')} style={{
            padding: '10px 18px', borderRadius: 12, border: 'none',
            background: 'rgba(34,197,94,0.15)', color: '#4ade80',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>+ Receita</button>
          <button onClick={() => openCreate('expense')} style={{
            padding: '10px 18px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>+ Despesa</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Receitas', value: totalIncome, color: '#4ade80', bg: 'rgba(34,197,94,0.1)' },
          { label: 'Despesas', value: totalExpenses, color: '#f87171', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Saldo', value: balance, color: balance >= 0 ? '#4ade80' : '#f87171', bg: 'rgba(99,102,241,0.1)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ padding: '18px 20px', borderRadius: 16, background: bg, border: `1px solid ${color}22` }}>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color }}>{formatCurrency(value)}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <TransactionFiltersBar
        filters={filters}
        categories={categories}
        onChange={setFilters}
        onReset={() => setFilters(EMPTY_FILTERS)}
      />

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '14px 18px', marginBottom: 16, color: '#f87171', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div>{Array.from({ length: 6 }).map((_, i) => <TransactionRowSkeleton key={i} />)}</div>
      ) : transactions.length === 0 ? (
        <EmptyState
          icon="💸"
          title="Nenhuma transação encontrada"
          description={Object.keys(filters).length > 0 ? 'Tente ajustar os filtros.' : 'Comece adicionando sua primeira transação.'}
          action={Object.keys(filters).length === 0 ? { label: '+ Adicionar transação', onClick: () => openCreate() } : undefined}
        />
      ) : (
        <div>{transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} onEdit={openEdit} onDelete={remove} />)}</div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editingTx ? 'Editar transação' : 'Nova transação'}>
        <TransactionForm
          transaction={editingTx}
          categories={categories}
          defaultType={defaultType}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  )
}
