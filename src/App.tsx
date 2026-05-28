import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react'
import {
  Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement,
  CategoryScale, LinearScale, Tooltip, Legend, Filler
} from 'chart.js'
import { Doughnut, Line } from 'react-chartjs-2'
import {
  LayoutGrid, TrendingUp, Target, User, Plus, Trash2, LogOut,
  ChevronRight, Wallet, ArrowUpCircle, ArrowDownCircle, Calendar,
  Settings, ArrowLeftRight, BarChart2
} from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { supabase } from './lib/supabase'
import { AppProvider } from './context/AppContext'
import { useAuth } from './hooks/useAuth'

// ── Lazy new pages ──────────────────────────────────────────
const TransactionsPage = lazy(() => import('./pages/transactions/TransactionsPage'))
const GoalsPage        = lazy(() => import('./pages/goals/GoalsPage'))
const AnalyticsPage    = lazy(() => import('./pages/analytics/AnalyticsPage'))
const SettingsPage     = lazy(() => import('./pages/settings/SettingsPage'))
import { LandingPage } from './app/components/landing/LandingPage'
import { LoginPage }   from './app/components/auth/LoginPage'

// ── Chart.js ────────────────────────────────────────────────
ChartJS.register(ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)
ChartJS.defaults.color = '#666'
ChartJS.defaults.plugins.tooltip.backgroundColor = '#1a1a1a'
ChartJS.defaults.plugins.tooltip.titleColor = '#fff'
ChartJS.defaults.plugins.tooltip.bodyColor = '#daeb44'
ChartJS.defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.08)'
ChartJS.defaults.plugins.tooltip.borderWidth = 1

// ── Types ───────────────────────────────────────────────────
interface Receita { desc: string; val: number }
interface Fixa    { desc: string; dia: string | number; val: number; pago: boolean }
interface Variavel { desc: string; val: number }
interface MesData { receitas: Receita[]; fixas: Fixa[]; variaveis: Variavel[] }
interface Meta    { desc: string; total: number; guardei: number }
interface AppData { months: string[]; mesData: Record<string, MesData>; metas: Meta[] }

const defaultMesData = (): MesData => ({
  receitas: [{ desc: 'Salário principal', val: 0 }, { desc: 'Renda extra', val: 0 }],
  fixas: [
    { desc: 'Aluguel / Financiamento', dia: 5, val: 0, pago: false },
    { desc: 'Energia elétrica', dia: 10, val: 0, pago: false },
    { desc: 'Água', dia: 15, val: 0, pago: false },
    { desc: 'Internet', dia: 10, val: 0, pago: false },
    { desc: 'Mercado', dia: '', val: 0, pago: false },
  ],
  variaveis: [],
})
const getDefaultData = (): AppData => ({
  months: ['Jan/2024', 'Fev/2024'],
  mesData: {
    'Jan/2024': { receitas: [{ desc: 'Salário', val: 5000 }], fixas: [{ desc: 'Aluguel', dia: 5, val: 1200, pago: true }], variaveis: [{ desc: 'Lazer', val: 800 }] },
    'Fev/2024': { receitas: [{ desc: 'Salário', val: 5200 }], fixas: [{ desc: 'Aluguel', dia: 5, val: 1200, pago: false }], variaveis: [{ desc: 'Restaurante', val: 400 }] },
  },
  metas: [{ desc: 'Reserva de Emergência', total: 0, guardei: 0 }, { desc: 'Viagem dos Sonhos', total: 0, guardei: 0 }],
})

const fmt = (v: number) => 'R$ ' + parseFloat((v || 0).toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const n = (v: unknown) => parseFloat(v as string) || 0
const calcMonth = (data: AppData, key: string) => {
  const m = data.mesData[key]
  if (!m) return { rec: 0, fixas: 0, variaveis: 0, pagar: 0, saldo: 0 }
  const rec = m.receitas.reduce((s, r) => s + n(r.val), 0)
  const fixas = m.fixas.reduce((s, r) => s + n(r.val), 0)
  const variaveis = m.variaveis.reduce((s, r) => s + n(r.val), 0)
  return { rec, fixas, variaveis, pagar: fixas + variaveis, saldo: rec - fixas - variaveis }
}

// ── Design tokens (tema original) ───────────────────────────
const T = {
  bg:       '#0d0d0d',
  sidebar:  '#141414',
  surface:  '#1a1a1a',
  hover:    '#252525',
  border:   'rgba(255,255,255,0.06)',
  borderHi: 'rgba(255,255,255,0.12)',
  purple:   '#640cd6',
  purpleBg: 'rgba(100,12,214,0.12)',
  purpleDim:'rgba(100,12,214,0.25)',
  lime:     '#daeb44',
  red:      '#ff4d4d',
  redBg:    'rgba(255,77,77,0.1)',
  blue:     '#3d91ff',
  blueBg:   'rgba(61,145,255,0.1)',
  textDim:  '#999',
  textDark: '#555',
  radius:   '12px',
  radiusLg: '18px',
}

const card: React.CSSProperties = {
  background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radiusLg, padding: '20px 22px',
}
const inp: React.CSSProperties = {
  background: T.hover, border: `1px solid ${T.border}`, borderRadius: T.radius,
  color: '#fff', fontSize: 13, padding: '9px 12px', outline: 'none',
  width: '100%', boxSizing: 'border-box' as const, fontFamily: 'inherit',
}
const btnPrimary: React.CSSProperties = {
  background: T.purple, color: '#fff', border: 'none', borderRadius: T.radius,
  padding: '10px 18px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
}
const btnOutline: React.CSSProperties = {
  background: 'transparent', color: '#fff', border: `1px solid ${T.borderHi}`, borderRadius: T.radius,
  padding: '9px 16px', fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
}

// ── Stat card ────────────────────────────────────────────────
function StatCard({ label, value, Icon, type }: { label: string; value: string; Icon: React.ElementType; type: 'purple'|'red'|'blue'|'dim' }) {
  const colors = {
    purple: { bg: T.purpleBg, border: T.purpleDim, color: T.purple, icon: T.purple },
    red:    { bg: T.redBg,    border: 'rgba(255,77,77,0.2)',  color: T.red,    icon: T.red },
    blue:   { bg: T.blueBg,   border: 'rgba(61,145,255,0.2)', color: T.blue,   icon: T.blue },
    dim:    { bg: T.surface,  border: T.border,  color: '#fff',   icon: T.textDim },
  }[type]
  return (
    <div style={{ ...card, background: colors.bg, border: `1px solid ${colors.border}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.25 }}>
        <Icon size={22} color={colors.icon} />
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 9, color: T.textDark, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: colors.color }}>{value}</p>
    </div>
  )
}

// ── MAIN APP ─────────────────────────────────────────────────
function MainApp() {
  const { isAuthenticated, initialized, user, profile, signOut } = useAuth() as any

  const [showLanding, setShowLanding] = useState(true)
  const [page, setPage] = useState('overview')
  const [currentMonth, setCurrentMonth] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState('resumo')
  const [newMonthInput, setNewMonthInput] = useState('')
  const [isSyncing, setIsSyncing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [data, setData] = useState<AppData>(getDefaultData())

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data: dbData, error } = await (supabase as any).from('user_data').select('data').eq('id', userId).maybeSingle()
      if (error) throw error
      if (dbData?.data) {
        const parsed = dbData.data as AppData
        setData(parsed)
        if (parsed.months.length > 0) setCurrentMonth(parsed.months[parsed.months.length - 1])
      } else {
        const local = localStorage.getItem('gestao_salario_v2')
        if (local) {
          const parsed = JSON.parse(local) as AppData
          setData(parsed)
          saveData(userId, parsed)
        }
      }
    } catch { toast.error('Erro ao sincronizar dados') }
  }, [])

  const saveData = async (userId: string, d: AppData) => {
    setIsSyncing(true)
    try {
      await (supabase as any).from('user_data').upsert({ id: userId, data: d, updated_at: new Date().toISOString() })
      localStorage.setItem('gestao_salario_v2', JSON.stringify(d))
    } catch { toast.error('Erro ao salvar') } finally { setIsSyncing(false) }
  }

  useEffect(() => { if (isAuthenticated && user) fetchUserData(user.id) }, [isAuthenticated, user, fetchUserData])

  const updateData = (fn: (d: AppData) => AppData) => {
    const nd = fn(data); setData(nd)
    if (user) saveData(user.id, nd)
  }

  const openMonth = (key: string) => { setCurrentMonth(key); setPage('mes'); setCurrentTab('resumo') }

  const addMonth = () => {
    const val = newMonthInput.trim()
    if (!val) return
    if (data.months.includes(val)) { toast.error('Mês já existe!'); return }
    const nd = { ...data, months: [...data.months, val], mesData: { ...data.mesData, [val]: defaultMesData() } }
    setData(nd); if (user) saveData(user.id, nd)
    setNewMonthInput(''); openMonth(val)
  }

  const deleteMonth = (e: React.MouseEvent, key: string) => {
    e.stopPropagation()
    if (!confirm(`Excluir ${key}?`)) return
    const newMonths = data.months.filter(m => m !== key)
    const newMesData = { ...data.mesData }; delete newMesData[key]
    const nd = { ...data, months: newMonths, mesData: newMesData }
    setData(nd); if (user) saveData(user.id, nd)
    if (currentMonth === key) { setCurrentMonth(newMonths[newMonths.length - 1] || null); setPage('overview') }
  }

  if (!initialized) return <Splash />
  if (!isAuthenticated) {
    if (showLanding) return <><LandingPage onGetStarted={() => setShowLanding(false)} /><Toaster richColors position="top-right" /></>
    return <><LoginPage onLoginSuccess={async () => { const { data: { session } } = await supabase.auth.getSession(); if (session?.user) fetchUserData(session.user.id) }} /><Toaster richColors position="top-right" /></>
  }

  const NAV_MAIN = [
    { id: 'overview',      Icon: LayoutGrid,    label: 'Painel Geral' },
    { id: 'transactions',  Icon: ArrowLeftRight, label: 'Transações' },
    { id: 'metas_new',     Icon: Target,         label: 'Metas' },
    { id: 'historico',     Icon: TrendingUp,     label: 'Análises' },
    { id: 'analytics_new', Icon: BarChart2,       label: 'Analytics Pro' },
  ]
  const NAV_ACCOUNT = [
    { id: 'perfil',       Icon: User,     label: 'Meu Perfil' },
    { id: 'config',       Icon: Settings, label: 'Configurações' },
  ]

  const pageTitle: Record<string, string> = {
    overview: 'Painel Geral', transactions: 'Transações', metas_new: 'Metas',
    historico: 'Análises', analytics_new: 'Analytics Pro', perfil: 'Meu Perfil',
    config: 'Configurações', mes: `Planejamento · ${currentMonth ?? ''}`,
  }

  return (
    <div className="dark" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: T.bg, color: '#fff', fontFamily: 'inherit' }}>
      <Toaster richColors position="top-right" />

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sidebarOpen ? 248 : 0, flexShrink: 0, overflow: 'hidden',
        background: T.sidebar, borderRight: `1px solid ${T.border}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ minWidth: 248, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo */}
          <div style={{ padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(100,12,214,0.15)', filter: 'blur(20px)', borderRadius: '50%' }} />
              <img src="/logobranca.svg" alt="Logo" style={{ width: 100, height: 100, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.35))' }}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div style={{ height: 1, width: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px', scrollbarWidth: 'none' }}>
            {/* Main nav */}
            <p style={{ fontSize: 9, color: T.textDark, fontWeight: 700, letterSpacing: '0.12em', padding: '10px 10px 6px', textTransform: 'uppercase' }}>Menu Principal</p>
            {NAV_MAIN.map(({ id, Icon, label }) => {
              const active = page === id
              return (
                <button key={id} onClick={() => setPage(id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 12px', borderRadius: T.radius, border: 'none', cursor: 'pointer', marginBottom: 2,
                  background: active ? T.purpleBg : 'transparent',
                  color: active ? T.purple : T.textDim,
                  fontSize: 14, fontWeight: active ? 700 : 500, transition: 'all 0.15s',
                }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.background = T.hover }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {label}
                </button>
              )
            })}

            {/* Planning */}
            <p style={{ fontSize: 9, color: T.textDark, fontWeight: 700, letterSpacing: '0.12em', padding: '14px 10px 6px', textTransform: 'uppercase' }}>Planejamento</p>
            <div style={{ maxHeight: 260, overflowY: 'auto', scrollbarWidth: 'none' }}>
              {data.months.map(m => {
                const active = m === currentMonth && page === 'mes'
                return (
                  <button key={m} onClick={() => openMonth(m)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', borderRadius: T.radius, border: 'none', cursor: 'pointer', marginBottom: 2,
                    background: active ? T.purpleBg : 'transparent',
                    color: active ? T.purple : T.textDim,
                    fontSize: 13, fontWeight: active ? 700 : 400, transition: 'all 0.15s',
                  }}
                    onMouseOver={e => { if (!active) e.currentTarget.style.background = T.hover }}
                    onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                    <Calendar size={15} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1, textAlign: 'left' }}>{m}</span>
                    <span onClick={e => deleteMonth(e, m)} title="Excluir"
                      style={{ padding: '2px 7px', borderRadius: 6, fontSize: 11, color: T.red, background: T.redBg, opacity: 0, transition: 'opacity 0.15s' }}
                      onMouseOver={e => (e.currentTarget.style.opacity = '1')}
                      onMouseOut={e => (e.currentTarget.style.opacity = '0')}>✕</span>
                  </button>
                )
              })}
            </div>

            {/* Add month */}
            <div style={{ padding: '10px 2px 6px', display: 'flex', gap: 7 }}>
              <input style={{ ...inp, fontSize: 12, padding: '8px 11px', background: T.surface }} placeholder="Novo mês (Ex: Jul/25)"
                value={newMonthInput} onChange={e => setNewMonthInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addMonth()} />
              <button onClick={addMonth} title="Adicionar mês"
                style={{ width: 36, height: 36, borderRadius: 10, border: 'none', background: T.purple, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plus size={16} />
              </button>
            </div>

            {/* Account nav */}
            <p style={{ fontSize: 9, color: T.textDark, fontWeight: 700, letterSpacing: '0.12em', padding: '10px 10px 6px', textTransform: 'uppercase' }}>Conta</p>
            {NAV_ACCOUNT.map(({ id, Icon, label }) => {
              const active = page === id
              return (
                <button key={id} onClick={() => setPage(id)} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: T.radius, border: 'none', cursor: 'pointer', marginBottom: 2,
                  background: active ? T.purpleBg : 'transparent',
                  color: active ? T.purple : T.textDim,
                  fontSize: 14, fontWeight: active ? 700 : 500, transition: 'all 0.15s',
                }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.background = T.hover }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {label}
                </button>
              )
            })}
          </div>

          {/* User footer */}
          <div style={{ padding: '14px 14px 18px', borderTop: `1px solid ${T.border}`, background: 'rgba(26,26,26,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: T.radius, cursor: 'pointer', transition: 'background 0.15s' }}
              onClick={() => setPage('perfil')}
              onMouseOver={e => (e.currentTarget.style.background = T.hover)}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: T.purpleBg, border: `1px solid ${T.purpleDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={16} color={T.purple} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: '0 0 1px', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.full_name || 'Minha Conta'}</p>
                <p style={{ margin: 0, fontSize: 10, color: T.textDim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
              </div>
              {isSyncing && <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.purple, flexShrink: 0, animation: 'pulse 1s infinite' }} />}
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Header */}
        <header style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', borderBottom: `1px solid ${T.border}`, background: 'rgba(13,13,13,0.85)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setSidebarOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textDim, padding: 6, borderRadius: 8, display: 'flex' }}>
              <LayoutGrid size={18} />
            </button>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: T.textDark, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{pageTitle[page] ?? ''}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {isSyncing && <span style={{ fontSize: 10, fontWeight: 700, color: T.purple, letterSpacing: '0.05em', animation: 'pulse 1s infinite' }}>SINCRONIZANDO...</span>}
            <button onClick={() => signOut()} title="Sair"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textDim, padding: 6, borderRadius: 8, display: 'flex' }}>
              <LogOut size={17} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px', scrollbarWidth: 'thin', scrollbarColor: `${T.borderHi} transparent` }}>
          <Suspense fallback={<PageLoader />}>
            {page === 'overview'      && <OverviewPage data={data} openMonth={openMonth} />}
            {page === 'mes'           && currentMonth && <MesPage data={data} currentMonth={currentMonth} currentTab={currentTab} setCurrentTab={setCurrentTab} updateData={updateData} />}
            {page === 'historico'     && <HistoricoPage data={data} openMonth={openMonth} />}
            {page === 'transactions'  && <TransactionsPage />}
            {page === 'metas_new'     && <GoalsPage />}
            {page === 'analytics_new' && <AnalyticsPage />}
            {page === 'perfil'        && <ProfilePage user={user} profile={profile} onSignOut={() => signOut()} />}
            {page === 'config'        && <SettingsPage />}
          </Suspense>
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

// ── SPLASH ───────────────────────────────────────────────────
function Splash() {
  const [elapsed, setElapsed] = React.useState(0)
  const TIMEOUT_SECONDS = 15
  const isTimedOut = elapsed >= TIMEOUT_SECONDS

  React.useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => {
        if (prev >= TIMEOUT_SECONDS) {
          clearInterval(interval)
          return TIMEOUT_SECONDS
        }
        return prev + 0.1
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.bg }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 40, marginBottom: 16, animation: isTimedOut ? 'none' : 'pulse 1s infinite' }}>💰</div>
        <p style={{ color: T.textDim, fontSize: 13, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 24 }}>
          {isTimedOut ? 'SINCRONIZAÇÃO DEMORADA...' : 'SINCRONIZANDO...'}
        </p>
        {isTimedOut && (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, padding: 16, marginTop: 16 }}>
            <p style={{ color: T.red, fontSize: 12, margin: '0 0 8px', fontWeight: 600 }}>⚠️ Sincronização demorada</p>
            <p style={{ color: T.textDim, fontSize: 11, margin: 0, lineHeight: 1.5 }}>
              Verifique sua conexão com a internet ou se as variáveis de ambiente do Supabase estão configuradas corretamente.
            </p>
          </div>
        )}
        <div style={{ marginTop: 24, fontSize: 11, color: T.textDark }}>
          {Math.floor(elapsed)}s / {TIMEOUT_SECONDS}s
        </div>
      </div>
    </div>
  )
}

function PageLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
      <div style={{ width: 30, height: 30, border: `3px solid ${T.purpleBg}`, borderTopColor: T.purple, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )
}

// ── OVERVIEW ─────────────────────────────────────────────────
function OverviewPage({ data, openMonth }: { data: AppData; openMonth: (m: string) => void }) {
  const allCalc = data.months.map(m => ({ mes: m, ...calcMonth(data, m) }))
  const totalRec = allCalc.reduce((s, m) => s + m.rec, 0)
  const totalPag = allCalc.reduce((s, m) => s + m.pagar, 0)
  const lastMonth = allCalc[allCalc.length - 1] || { saldo: 0 }

  const chartData = {
    labels: allCalc.map(m => m.mes),
    datasets: [
      { label: 'Entradas', data: allCalc.map(m => m.rec), borderColor: T.lime, backgroundColor: 'rgba(218,235,68,0.06)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: T.lime },
      { label: 'Saídas', data: allCalc.map(m => m.pagar), borderColor: T.red, backgroundColor: 'rgba(255,77,77,0.06)', fill: true, tension: 0.4, pointRadius: 4, pointBackgroundColor: T.red },
    ],
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px' }}>Painel Geral</h1>
        <p style={{ margin: 0, fontSize: 14, color: T.textDim }}>Visão consolidada de todos os períodos</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total Recebido"  value={fmt(totalRec)}            Icon={ArrowUpCircle}  type="blue" />
        <StatCard label="Total Pago"      value={fmt(totalPag)}            Icon={ArrowDownCircle} type="red" />
        <StatCard label="Saldo Acumulado" value={fmt(totalRec - totalPag)} Icon={Wallet}          type="purple" />
        <StatCard label="Último Mês"      value={fmt(lastMonth.saldo)}     Icon={Calendar}        type="dim" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Evolução Financeira</p>
            <div style={{ display: 'flex', gap: 16 }}>
              {[{ color: T.lime, label: 'ENTRADAS' }, { color: T.red, label: 'SAÍDAS' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, fontWeight: 700, color: T.textDark, letterSpacing: '0.08em' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: 280 }}>
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.03)' }, border: { display: false } }, x: { grid: { display: false } } } }} />
          </div>
        </div>
        <div style={card}>
          <p style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Meses Recentes</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allCalc.slice(-6).reverse().map(m => (
              <div key={m.mes} onClick={() => openMonth(m.mes)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: T.radius, background: T.hover, border: `1px solid ${T.border}`, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.borderColor = T.purpleDim)}
                onMouseOut={e => (e.currentTarget.style.borderColor = T.border)}>
                <div>
                  <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700 }}>{m.mes}</p>
                  <p style={{ margin: 0, fontSize: 10, color: T.textDim }}>Saldo: <span style={{ color: m.saldo >= 0 ? T.lime : T.red, fontWeight: 700 }}>{fmt(m.saldo)}</span></p>
                </div>
                <ChevronRight size={15} color={T.textDark} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MES PAGE ─────────────────────────────────────────────────
function MesPage({ data, currentMonth, currentTab, setCurrentTab, updateData }: { data: AppData; currentMonth: string; currentTab: string; setCurrentTab: (t: string) => void; updateData: (fn: (d: AppData) => AppData) => void }) {
  const calc = calcMonth(data, currentMonth)
  const tabs = ['resumo', 'receitas', 'despesas', 'graficos']
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 32, fontWeight: 700, letterSpacing: '-0.5px' }}>{currentMonth}</h1>
          <p style={{ margin: 0, fontSize: 14, color: T.textDim }}>Gerenciamento detalhado do fluxo de caixa</p>
        </div>
        <div style={{ display: 'flex', background: T.surface, border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: 'hidden' }}>
          <div style={{ padding: '10px 18px', borderRight: `1px solid ${T.border}`, textAlign: 'center' }}>
            <p style={{ margin: '0 0 2px', fontSize: 9, color: T.textDark, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Saldo</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: calc.saldo >= 0 ? T.lime : T.red }}>{fmt(calc.saldo)}</p>
          </div>
          <div style={{ padding: '10px 18px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 2px', fontSize: 9, color: T.textDark, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Economia</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.blue }}>{calc.rec ? ((calc.saldo / calc.rec) * 100).toFixed(1) : 0}%</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', background: T.surface, borderRadius: T.radius, padding: 4, marginBottom: 24, border: `1px solid ${T.border}` }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setCurrentTab(t)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13,
            fontWeight: currentTab === t ? 700 : 500, textTransform: 'capitalize',
            background: currentTab === t ? T.hover : 'transparent',
            color: currentTab === t ? T.purple : T.textDim, transition: 'all 0.15s',
          }}>{t === 'graficos' ? 'Gráficos' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      {currentTab === 'resumo'   && <ResumoTab data={data} currentMonth={currentMonth} calc={calc} updateData={updateData} />}
      {currentTab === 'receitas' && <ReceitasTab data={data} currentMonth={currentMonth} updateData={updateData} />}
      {currentTab === 'despesas' && <DespesasTab data={data} currentMonth={currentMonth} updateData={updateData} />}
      {currentTab === 'graficos' && <GraficosTab data={data} currentMonth={currentMonth} calc={calc} />}
    </div>
  )
}

function ResumoTab({ data, currentMonth, calc, updateData }: any) {
  const m = data.mesData[currentMonth]
  const togglePago = (idx: number, val: boolean) => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], fixas: d.mesData[currentMonth].fixas.map((f: Fixa, i: number) => i === idx ? { ...f, pago: val } : f) } } }))
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <StatCard label="Recebido"    value={fmt(calc.rec)}       Icon={ArrowUpCircle}  type="blue" />
        <StatCard label="A Pagar"     value={fmt(calc.pagar)}     Icon={ArrowDownCircle} type="red" />
        <StatCard label="Saldo Livre" value={fmt(calc.saldo)}     Icon={Wallet}          type="purple" />
        <StatCard label="Gasto Diário" value={fmt(calc.saldo/30)} Icon={TrendingUp}      type="dim" />
      </div>
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.purple, animation: 'pulse 1s infinite' }} />
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: T.textDark, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contas Pendentes</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {['Descrição', 'Valor', 'Vencimento', 'Pago'].map((h, i) => (
                <th key={h} style={{ padding: '8px 12px', fontSize: 9, color: T.textDark, textAlign: (i >= 1 && i <= 2) ? 'right' : i === 3 ? 'center' : 'left', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.fixas.filter((f: Fixa) => n(f.val) > 0).map((f: Fixa, i: number) => {
              const idx = m.fixas.indexOf(f)
              return (
                <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, opacity: f.pago ? 0.35 : 1, transition: 'opacity 0.2s' }}>
                  <td style={{ padding: '12px', fontSize: 13, textDecoration: f.pago ? 'line-through' : 'none', color: f.pago ? T.textDim : '#fff' }}>{f.desc}</td>
                  <td style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: T.red, textAlign: 'right', textDecoration: f.pago ? 'line-through' : 'none' }}>{fmt(f.val)}</td>
                  <td style={{ padding: '12px', fontSize: 12, color: T.textDim, textAlign: 'right' }}>{f.dia ? `Dia ${f.dia}` : '—'}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}><input type="checkbox" checked={f.pago} onChange={e => togglePago(idx, e.target.checked)} style={{ width: 17, height: 17, accentColor: T.purple, cursor: 'pointer' }} /></td>
                </tr>
              )
            })}
            {m.fixas.filter((f: Fixa) => n(f.val) > 0).length === 0 && (
              <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: T.textDim, fontSize: 13 }}>Nenhuma conta pendente este mês 🎉</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReceitasTab({ data, currentMonth, updateData }: any) {
  const m = data.mesData[currentMonth]
  const add    = () => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], receitas: [...d.mesData[currentMonth].receitas, { desc: 'Nova receita', val: 0 }] } } }))
  const upd    = (i: number, f: string, v: string) => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], receitas: d.mesData[currentMonth].receitas.map((r: Receita, j: number) => j === i ? { ...r, [f]: f === 'val' ? parseFloat(v)||0 : v } : r) } } }))
  const del    = (i: number) => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], receitas: d.mesData[currentMonth].receitas.filter((_: Receita, j: number) => j !== i) } } }))
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Gestão de Entradas</h3>
        <button onClick={add} style={btnPrimary}><Plus size={15} /> Adicionar</button>
      </div>
      <div style={card}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {['Descrição', 'Valor (R$)', ''].map(h => <th key={h} style={{ padding: '8px 12px', fontSize: 9, color: T.textDark, textAlign: 'left', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {m.receitas.map((r: Receita, i: number) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                <td style={{ padding: '10px 12px' }}><input value={r.desc} onChange={e => upd(i, 'desc', e.target.value)} style={{ ...inp, background: 'transparent', border: 'none', borderBottom: `1px solid ${T.border}`, borderRadius: 0, padding: '4px 0' }} /></td>
                <td style={{ padding: '10px 12px' }}><input type="number" value={r.val || ''} onChange={e => upd(i, 'val', e.target.value)} style={{ ...inp, width: 130, background: 'transparent', border: 'none', borderBottom: `1px solid ${T.border}`, borderRadius: 0, padding: '4px 0', color: T.blue, fontWeight: 700, textAlign: 'right' }} /></td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}><button onClick={() => del(i)} style={{ background: T.redBg, border: 'none', borderRadius: 8, color: T.red, cursor: 'pointer', padding: '6px 9px', display: 'inline-flex' }}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DespesasTab({ data, currentMonth, updateData }: any) {
  const m = data.mesData[currentMonth]
  const addF  = () => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], fixas: [...d.mesData[currentMonth].fixas, { desc: 'Nova fixa', dia: '', val: 0, pago: false }] } } }))
  const addV  = () => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], variaveis: [...d.mesData[currentMonth].variaveis, { desc: 'Nova variável', val: 0 }] } } }))
  const updF  = (i: number, f: string, v: string) => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], fixas: d.mesData[currentMonth].fixas.map((r: Fixa, j: number) => j===i ? { ...r, [f]: f==='val' ? parseFloat(v)||0 : v } : r) } } }))
  const updV  = (i: number, f: string, v: string) => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], variaveis: d.mesData[currentMonth].variaveis.map((r: Variavel, j: number) => j===i ? { ...r, [f]: f==='val' ? parseFloat(v)||0 : v } : r) } } }))
  const delF  = (i: number) => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], fixas: d.mesData[currentMonth].fixas.filter((_: Fixa, j: number) => j!==i) } } }))
  const delV  = (i: number) => updateData((d: AppData) => ({ ...d, mesData: { ...d.mesData, [currentMonth]: { ...d.mesData[currentMonth], variaveis: d.mesData[currentMonth].variaveis.filter((_: Variavel, j: number) => j!==i) } } }))
  const th: React.CSSProperties = { padding: '8px 10px', fontSize: 9, color: T.textDark, textAlign: 'left', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }
  const td: React.CSSProperties = { padding: '9px 10px', borderBottom: `1px solid ${T.border}` }
  const tdinp = { ...inp, background: 'transparent', border: 'none', borderBottom: `1px solid ${T.border}`, borderRadius: 0, padding: '4px 0', fontSize: 12 }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Custos Fixos</h3>
          <button onClick={addF} style={btnOutline}><Plus size={13} /> Fixa</button>
        </div>
        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>Desc</th><th style={{ ...th, textAlign: 'center', width: 50 }}>Dia</th><th style={{ ...th, textAlign: 'right' }}>Valor</th><th style={{ ...th, width: 36 }} /></tr></thead>
            <tbody>{m.fixas.map((f: Fixa, i: number) => (
              <tr key={i}><td style={td}><input value={f.desc} onChange={e => updF(i,'desc',e.target.value)} style={tdinp} /></td>
              <td style={td}><input value={f.dia} onChange={e => updF(i,'dia',e.target.value)} style={{ ...tdinp, width: 40, textAlign: 'center' }} /></td>
              <td style={td}><input type="number" value={f.val||''} onChange={e => updF(i,'val',e.target.value)} style={{ ...tdinp, color: T.red, fontWeight: 700, textAlign: 'right', width: 90 }} /></td>
              <td style={td}><button onClick={() => delF(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.red, padding: 4 }}><Trash2 size={13} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>Custos Variáveis</h3>
          <button onClick={addV} style={btnOutline}><Plus size={13} /> Variável</button>
        </div>
        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>Desc</th><th style={{ ...th, textAlign: 'right' }}>Valor</th><th style={{ ...th, width: 36 }} /></tr></thead>
            <tbody>{m.variaveis.map((v: Variavel, i: number) => (
              <tr key={i}><td style={td}><input value={v.desc} onChange={e => updV(i,'desc',e.target.value)} style={tdinp} /></td>
              <td style={td}><input type="number" value={v.val||''} onChange={e => updV(i,'val',e.target.value)} style={{ ...tdinp, color: T.red, fontWeight: 700, textAlign: 'right', width: 90 }} /></td>
              <td style={td}><button onClick={() => delV(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.red, padding: 4 }}><Trash2 size={13} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function GraficosTab({ data, currentMonth, calc }: any) {
  const m = data.mesData[currentMonth]
  const fixas = m.fixas.reduce((s: number, r: Fixa) => s + n(r.val), 0)
  const variaveis = m.variaveis.reduce((s: number, r: Variavel) => s + n(r.val), 0)
  const doughnutData = { labels: ['Custos Fixos', 'Custos Variáveis', 'Saldo Livre'], datasets: [{ data: [fixas, variaveis, Math.max(0, calc.saldo)], backgroundColor: [T.red, T.blue, T.lime], borderWidth: 0, hoverOffset: 10 }] }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'center' }}>
      <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Doughnut data={doughnutData} options={{ cutout: '72%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 20, color: T.textDim, font: { size: 12 } } } } }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[{ label: 'Fixos', value: fixas, color: T.red }, { label: 'Variáveis', value: variaveis, color: T.blue }, { label: 'Saldo Livre', value: calc.saldo, color: T.lime }].map(row => (
          <div key={row.label} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: row.color }} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>{row.label}</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: row.color }}>{fmt(row.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function HistoricoPage({ data, openMonth }: { data: AppData; openMonth: (m: string) => void }) {
  const allCalc = data.months.map(m => ({ mes: m, ...calcMonth(data, m) })).reverse()
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 30, fontWeight: 700, letterSpacing: '-0.4px' }}>Histórico de Fluxo</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {allCalc.map(m => (
          <div key={m.mes} onClick={() => openMonth(m.mes)}
            style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.15s', flexWrap: 'wrap', gap: 14 }}
            onMouseOver={e => { e.currentTarget.style.borderColor = T.purpleDim }}
            onMouseOut={e => { e.currentTarget.style.borderColor = T.border }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: T.radius, background: T.purpleBg, border: `1px solid ${T.purpleDim}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: T.purple, fontSize: 12 }}>
                {m.mes.split('/')[0]}
              </div>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700 }}>{m.mes}</p>
                <p style={{ margin: 0, fontSize: 11, color: T.textDim }}>Economia: {m.rec ? ((m.saldo / m.rec) * 100).toFixed(1) : 0}%</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              {[{ label: 'Entradas', value: m.rec, color: T.lime }, { label: 'Saídas', value: m.pagar, color: T.red }, { label: 'Saldo', value: m.saldo, color: m.saldo >= 0 ? T.lime : T.red }].map(r => (
                <div key={r.label} style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 2px', fontSize: 9, color: T.textDark, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{r.label}</p>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: r.color }}>{fmt(r.value)}</p>
                </div>
              ))}
              <ChevronRight size={18} color={T.textDark} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePage({ user, profile, onSignOut }: { user: any; profile: any; onSignOut: () => void }) {
  const { updateProfile } = useAuth() as any
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [loading, setLoading] = useState(false)
  const handleSave = async () => {
    setLoading(true)
    try { await updateProfile({ full_name: fullName }); toast.success('Perfil atualizado!') }
    catch { toast.error('Erro ao salvar') } finally { setLoading(false) }
  }
  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 24px', fontSize: 28, fontWeight: 700 }}>Meu Perfil</h1>
      <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: T.purpleBg, border: `2px solid ${T.purple}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: T.purple }}>
            {(fullName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 16, fontWeight: 700 }}>{fullName || 'Usuário'}</p>
            <p style={{ margin: 0, fontSize: 13, color: T.textDim }}>{user?.email}</p>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 9, color: T.textDark, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Nome completo</label>
          <input style={inp} value={fullName} placeholder="Seu nome" onChange={e => setFullName(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 9, color: T.textDark, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>Email</label>
          <input style={{ ...inp, opacity: 0.45 }} value={user?.email ?? ''} disabled />
        </div>
        <button onClick={handleSave} disabled={loading} style={{ ...btnPrimary, justifyContent: 'center', padding: '13px', fontSize: 14, opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <button onClick={onSignOut} style={{ ...btnOutline, justifyContent: 'center', padding: '12px', fontSize: 14, borderColor: 'rgba(255,77,77,0.3)', color: T.red, background: T.redBg }}>
          <LogOut size={15} /> Sair da conta
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return <AppProvider><MainApp /></AppProvider>
}
