import React, { useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { formatCurrency, formatPercentage } from '../../utils/currency'
import { getLastNMonths } from '../../utils/date'
import { EmptyState } from '../../components/common/EmptyState'

export default function AnalyticsPage() {
  const { transactions, loading } = useTransactions()
  const [period, setPeriod] = useState(6)

  const months = getLastNMonths(period)

  const monthlyData = months.map(({ label, start, end }) => {
    const monthTx = transactions.filter(
      (t) => t.transaction_date >= start && t.transaction_date <= end
    )
    const income = monthTx.filter((t) => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)
    const expenses = monthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)
    return { label, income, expenses, balance: income - expenses, count: monthTx.length }
  })

  const maxVal = Math.max(...monthlyData.map((m) => Math.max(m.income, m.expenses)), 1)

  // Category breakdown
  const catMap = new Map<string, { name: string; icon: string; color: string; total: number }>()
  transactions.filter((t) => t.type === 'expense' && (t as any).categories).forEach((t) => {
    const cat = (t as any).categories
    const key = t.category_id ?? 'other'
    const ex = catMap.get(key)
    if (ex) ex.total += Number(t.amount)
    else catMap.set(key, { name: cat.name, icon: cat.icon ?? '📂', color: cat.color ?? '#6366f1', total: Number(t.amount) })
  })
  const catData = Array.from(catMap.values()).sort((a, b) => b.total - a.total)
  const totalExpenses = catData.reduce((s, c) => s + c.total, 0)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#fff' }}>Analytics</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Análise detalhada das suas finanças</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {[3, 6, 12].map((n) => (
            <button key={n} onClick={() => setPeriod(n)} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', background: period === n ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)', color: period === n ? '#a5b4fc' : 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer', fontWeight: period === n ? 600 : 400 }}>
              {n}M
            </button>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 20 }}>
        <h2 style={{ margin: '0 0 24px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Receitas vs Despesas</h2>
        {loading ? (
          <div style={{ height: 180, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }} />
        ) : transactions.length === 0 ? (
          <EmptyState icon="📊" title="Sem dados" description="Adicione transações para ver o gráfico." />
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, paddingBottom: 8 }}>
              {monthlyData.map((m) => (
                <div key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%' }}>
                    <div style={{ flex: 1, background: 'rgba(34,197,94,0.6)', borderRadius: '4px 4px 0 0', height: `${(m.income / maxVal) * 100}%`, minHeight: m.income > 0 ? 4 : 0, transition: 'height 0.4s ease' }} />
                    <div style={{ flex: 1, background: 'rgba(239,68,68,0.6)', borderRadius: '4px 4px 0 0', height: `${(m.expenses / maxVal) * 100}%`, minHeight: m.expenses > 0 ? 4 : 0, transition: 'height 0.4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {monthlyData.map((m) => (
                <div key={m.label} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>{m.label}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(34,197,94,0.6)', display: 'inline-block' }} /> Receitas
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(239,68,68,0.6)', display: 'inline-block' }} /> Despesas
              </span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Category breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Gastos por Categoria</h2>
          {catData.length === 0 ? (
            <EmptyState icon="📂" title="Sem dados" description="Categorize suas despesas." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {catData.slice(0, 8).map((c) => (
                <div key={c.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: '#fff' }}>{c.icon} {c.name}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#f87171' }}>{formatCurrency(c.total)}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>{formatPercentage(totalExpenses > 0 ? (c.total / totalExpenses) * 100 : 0)}</span>
                    </div>
                  </div>
                  <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${totalExpenses > 0 ? (c.total / totalExpenses) * 100 : 0}%`, background: c.color, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly summary table */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Resumo Mensal</h2>
          <div>
            {monthlyData.map((m) => (
              <div key={m.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize', minWidth: 60 }}>{m.label}</span>
                <span style={{ fontSize: 12, color: '#4ade80' }}>{formatCurrency(m.income)}</span>
                <span style={{ fontSize: 12, color: '#f87171' }}>{formatCurrency(m.expenses)}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: m.balance >= 0 ? '#4ade80' : '#f87171' }}>{formatCurrency(m.balance)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
