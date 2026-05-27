import React, { useState } from 'react'
import { useGoals } from '../../hooks/useGoals'
import { Modal } from '../../components/common/Modal'
import { EmptyState } from '../../components/common/EmptyState'
import { CardSkeleton } from '../../components/common/Skeleton'
import { formatCurrency, formatPercentage } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import type { GoalWithProgress } from '../../types/goal.types'
import type { GoalInsert } from '../../types/finance.types'

const ICONS = ['🎯', '🏠', '✈️', '🚗', '📚', '💻', '💍', '🏋️', '🎓', '💰']
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#14b8a6', '#3b82f6', '#ef4444', '#f59e0b', '#06b6d4']

function GoalForm({
  goal, onSubmit, onCancel,
}: {
  goal?: GoalWithProgress | null
  onSubmit: (data: Omit<GoalInsert, 'user_id'>) => Promise<void>
  onCancel: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: goal?.name ?? '',
    target_amount: goal?.target_amount ? String(goal.target_amount) : '',
    current_amount: goal?.current_amount ? String(goal.current_amount) : '0',
    due_date: goal?.due_date ?? '',
    icon: goal?.icon ?? '🎯',
    color: goal?.color ?? '#6366f1',
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const target = parseFloat(form.target_amount.replace(',', '.'))
    if (!form.name.trim()) return setError('Nome obrigatório')
    if (isNaN(target) || target <= 0) return setError('Valor alvo inválido')
    setLoading(true)
    try {
      await onSubmit({
        name: form.name.trim(),
        target_amount: target,
        current_amount: parseFloat(form.current_amount.replace(',', '.')) || 0,
        due_date: form.due_date || null,
        icon: form.icon,
        color: form.color,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Icon picker */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ícone</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ICONS.map((ic) => (
            <button key={ic} type="button" onClick={() => set('icon', ic)}
              style={{ fontSize: 22, width: 40, height: 40, borderRadius: 10, border: form.icon === ic ? '2px solid #6366f1' : '2px solid transparent', background: 'rgba(255,255,255,0.06)', cursor: 'pointer' }}>
              {ic}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cor</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {COLORS.map((c) => (
            <button key={c} type="button" onClick={() => set('color', c)}
              style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid #fff' : '3px solid transparent', cursor: 'pointer' }} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nome da meta</label>
        <input style={inputStyle} value={form.name} placeholder="Ex: Viagem para Europa" required onChange={(e) => set('name', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor alvo (R$)</label>
          <input style={inputStyle} value={form.target_amount} placeholder="0,00" inputMode="decimal" required onChange={(e) => set('target_amount', e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Já poupado (R$)</label>
          <input style={inputStyle} value={form.current_amount} placeholder="0,00" inputMode="decimal" onChange={(e) => set('current_amount', e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data limite (opcional)</label>
        <input style={inputStyle} type="date" value={form.due_date} onChange={(e) => set('due_date', e.target.value)} />
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>{error}</div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
        <button type="submit" disabled={loading} style={{ flex: 2, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Salvando...' : goal ? 'Salvar alterações' : 'Criar meta'}
        </button>
      </div>
    </form>
  )
}

function GoalCard({
  goal, onEdit, onDelete, onAddFunds,
}: {
  goal: GoalWithProgress
  onEdit: (g: GoalWithProgress) => void
  onDelete: (id: string) => void
  onAddFunds: (g: GoalWithProgress) => void
}) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: goal.color, opacity: 0.08, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${goal.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{goal.icon}</div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 600, color: '#fff' }}>{goal.name}</p>
            {goal.due_date && (
              <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                Prazo: {formatDate(goal.due_date)}
                {goal.daysRemaining !== null && goal.daysRemaining >= 0 && ` · ${goal.daysRemaining}d restantes`}
              </p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => onEdit(goal)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', cursor: 'pointer', fontSize: 14 }}>✏</button>
          <button onClick={() => { if (confirm('Excluir esta meta?')) onDelete(goal.id) }} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#f87171', cursor: 'pointer', fontSize: 14 }}>🗑</button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{formatCurrency(goal.current_amount)}</span>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>de {formatCurrency(goal.target_amount)}</span>
        </div>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${goal.progressPercentage}%`, background: goal.isCompleted ? '#4ade80' : goal.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 12, color: goal.isCompleted ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>
            {goal.isCompleted ? '✓ Concluída!' : `${formatPercentage(goal.progressPercentage)} completo`}
          </span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Faltam {formatCurrency(goal.remainingAmount)}</span>
        </div>
      </div>

      {!goal.isCompleted && (
        <button onClick={() => onAddFunds(goal)} style={{ width: '100%', padding: '10px', borderRadius: 12, border: `1px solid ${goal.color}44`, background: `${goal.color}11`, color: goal.color, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          + Adicionar valor
        </button>
      )}
    </div>
  )
}

export default function GoalsPage() {
  const { goals, loading, create, update, remove, addFunds } = useGoals()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<GoalWithProgress | null>(null)
  const [addFundsGoal, setAddFundsGoal] = useState<GoalWithProgress | null>(null)
  const [fundsAmount, setFundsAmount] = useState('')
  const [fundsLoading, setFundsLoading] = useState(false)

  const openCreate = () => { setEditingGoal(null); setModalOpen(true) }
  const openEdit = (g: GoalWithProgress) => { setEditingGoal(g); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditingGoal(null) }

  const handleSubmit = async (data: Omit<GoalInsert, 'user_id'>) => {
    if (editingGoal) await update(editingGoal.id, data)
    else await create(data)
    closeModal()
  }

  const handleAddFunds = async () => {
    if (!addFundsGoal) return
    const amount = parseFloat(fundsAmount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) return
    setFundsLoading(true)
    try {
      await addFunds(addFundsGoal.id, amount)
      setAddFundsGoal(null)
      setFundsAmount('')
    } finally {
      setFundsLoading(false)
    }
  }

  const completed = goals.filter((g) => g.isCompleted)
  const active = goals.filter((g) => !g.isCompleted)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#fff' }}>Metas</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{active.length} ativa{active.length !== 1 ? 's' : ''} · {completed.length} concluída{completed.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} style={{ padding: '10px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
          + Nova meta
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : goals.length === 0 ? (
        <EmptyState icon="🎯" title="Nenhuma meta cadastrada" description="Defina objetivos financeiros e acompanhe seu progresso." action={{ label: '+ Criar primeira meta', onClick: openCreate }} />
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Em andamento</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
                {active.map((g) => <GoalCard key={g.id} goal={g} onEdit={openEdit} onDelete={remove} onAddFunds={(g) => { setAddFundsGoal(g); setFundsAmount('') }} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Concluídas 🎉</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {completed.map((g) => <GoalCard key={g.id} goal={g} onEdit={openEdit} onDelete={remove} onAddFunds={(g) => { setAddFundsGoal(g); setFundsAmount('') }} />)}
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editingGoal ? 'Editar meta' : 'Nova meta'}>
        <GoalForm goal={editingGoal} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>

      <Modal open={!!addFundsGoal} onClose={() => setAddFundsGoal(null)} title={`Adicionar valor — ${addFundsGoal?.name ?? ''}`} width={360}>
        <div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>
            Atual: {formatCurrency(addFundsGoal?.current_amount ?? 0)} / {formatCurrency(addFundsGoal?.target_amount ?? 0)}
          </p>
          <input
            style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 18, outline: 'none', textAlign: 'center', boxSizing: 'border-box', marginBottom: 16 }}
            placeholder="R$ 0,00" value={fundsAmount} inputMode="decimal"
            onChange={(e) => setFundsAmount(e.target.value)}
          />
          <button onClick={handleAddFunds} disabled={fundsLoading} style={{ width: '100%', padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: 15, fontWeight: 600, cursor: fundsLoading ? 'wait' : 'pointer', opacity: fundsLoading ? 0.7 : 1 }}>
            {fundsLoading ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
