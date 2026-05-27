import React from 'react'
import { useDashboard } from '../../hooks/useDashboard'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency, formatPercentage } from '../../utils/currency'
import { formatDate } from '../../utils/date'
import { CardSkeleton, TransactionRowSkeleton } from '../../components/common/Skeleton'
import { EmptyState } from '../../components/common/EmptyState'

export default function DashboardPage() {
  const { summary, loading, error } = useDashboard()
  const { profile, user } = useAuth()
  const displayName = profile?.full_name ?? user?.email?.split('@')[0] ?? 'Usuário'

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ height: 28, width: 200, background: 'rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 16, width: 140, background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
          {[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 16, padding: 24, color: '#f87171' }}>
        Erro ao carregar dashboard: {error}
      </div>
    )
  }

  const s = summary

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#fff' }}>
          Olá, {displayName.split(' ')[0]} 👋
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          Aqui está o resumo financeiro do mês atual
        </p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          {
            label: 'Saldo', value: formatCurrency(s?.balance ?? 0),
            sub: 'Mês atual', color: (s?.balance ?? 0) >= 0 ? '#4ade80' : '#f87171',
            bg: (s?.balance ?? 0) >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            icon: '💰',
          },
          {
            label: 'Receitas', value: formatCurrency(s?.totalIncome ?? 0),
            sub: `${s?.transactionCount ?? 0} transações`, color: '#4ade80',
            bg: 'rgba(34,197,94,0.08)', icon: '📈',
          },
          {
            label: 'Despesas', value: formatCurrency(s?.totalExpenses ?? 0),
            sub: 'Mês atual', color: '#f87171',
            bg: 'rgba(239,68,68,0.08)', icon: '📉',
          },
          {
            label: 'Taxa de Poupança', value: formatPercentage(s?.savingsRate ?? 0),
            sub: 'Da receita poupada', color: '#a78bfa',
            bg: 'rgba(99,102,241,0.08)', icon: '🏦',
          },
        ].map(({ label, value, sub, color, bg, icon }) => (
          <div key={label} style={{
            padding: '20px', borderRadius: 18,
            background: bg, border: `1px solid ${color}22`,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 14, right: 16, fontSize: 24, opacity: 0.3 }}>{icon}</div>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
            <p style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color }}>{value}</p>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Monthly trend */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Tendência Mensal</h2>
          {s?.monthlyTrend && s.monthlyTrend.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {s.monthlyTrend.slice(-4).map((m) => {
                const maxVal = Math.max(...s.monthlyTrend.map((x) => Math.max(x.income, x.expenses)))
                const incomeW = maxVal > 0 ? (m.income / maxVal) * 100 : 0
                const expW = maxVal > 0 ? (m.expenses / maxVal) * 100 : 0
                return (
                  <div key={m.month}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{m.month}</span>
                      <span style={{ fontSize: 12, color: m.balance >= 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                        {formatCurrency(m.balance)}
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${incomeW}%`, background: '#4ade80', borderRadius: 4 }} />
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${expW}%`, background: '#f87171', borderRadius: 4 }} />
                    </div>
                  </div>
                )
              })}
              <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ width: 10, height: 4, background: '#4ade80', borderRadius: 2, display: 'inline-block' }} /> Receitas
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ width: 10, height: 4, background: '#f87171', borderRadius: 2, display: 'inline-block' }} /> Despesas
                </span>
              </div>
            </div>
          ) : (
            <EmptyState icon="📊" title="Sem dados" description="Adicione transações para ver a tendência." />
          )}
        </div>

        {/* Top categories */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Top Categorias</h2>
          {s?.topCategories && s.topCategories.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {s.topCategories.map(({ category, total, percentage }) => (
                <div key={category.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#fff' }}>
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#f87171' }}>{formatCurrency(total)}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, background: category.color ?? '#6366f1', borderRadius: 3, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📂" title="Sem categorias" description="Adicione despesas categorizadas." />
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 24 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#fff' }}>Transações Recentes</h2>
        {s?.recentTransactions && s.recentTransactions.length > 0 ? (
          <div>
            {s.recentTransactions.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {(t as any).categories?.icon ?? (t.type === 'income' ? '💰' : '💸')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{formatDate(t.transaction_date)}</p>
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: t.type === 'income' ? '#4ade80' : '#f87171', flexShrink: 0 }}>
                  {t.type === 'income' ? '+' : '-'} {formatCurrency(Number(t.amount))}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="💸" title="Nenhuma transação" description="Nenhuma transação este mês ainda." />
        )}
      </div>
    </div>
  )
}
