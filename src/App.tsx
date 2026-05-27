import React, { Suspense, lazy } from 'react'
import { AppProvider, useAppContext } from './context/AppContext'
import { useAuth } from './hooks/useAuth'
import { AppShell } from './components/layout/AppShell'
import { Skeleton } from './components/common/Skeleton'
import { useState } from 'react'

// Lazy pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const TransactionsPage = lazy(() => import('./pages/transactions/TransactionsPage'))
const GoalsPage = lazy(() => import('./pages/goals/GoalsPage'))
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage'))
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'))

// ─── Page router ──────────────────────────────────────────────────────────────

function PageContent({ page }: { page: string }) {
  switch (page) {
    case 'dashboard': return <DashboardPage />
    case 'transactions': return <TransactionsPage />
    case 'goals': return <GoalsPage />
    case 'analytics': return <AnalyticsPage />
    case 'profile': return <ProfilePage />
    case 'settings': return <SettingsPage />
    default: return <DashboardPage />
  }
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

function AuthGate() {
  const { isAuthenticated, initialized, loading } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')

  if (!initialized || loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0b0c14',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 auto 16px',
          }}>N</div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Render the existing login page/component
    // This preserves whatever login UI was in the original app
    return <LoginFallback />
  }

  return (
    <AppShell currentPage={currentPage} onNavigate={setCurrentPage}>
      <Suspense fallback={
        <div style={{ padding: 24 }}>
          <Skeleton height={32} width="30%" style={{ marginBottom: 24 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} height={100} borderRadius={16} />
            ))}
          </div>
        </div>
      }>
        <PageContent page={currentPage} />
      </Suspense>
    </AppShell>
  )
}

// Fallback para manter compatibilidade com o login existente
function LoginFallback() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === 'signup') {
        await signUp(email, password, fullName)
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  const input: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: 12,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12,
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0b0c14',
    }}>
      <div style={{
        width: 400, background: '#1a1b2e', borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.08)', padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 700, color: '#fff',
          }}>N</div>
          <h1 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700, color: '#fff' }}>NAVEX Finance</h1>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
            {mode === 'signin' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <input style={input} placeholder="Nome completo" value={fullName}
              onChange={(e) => setFullName(e.target.value)} required />
          )}
          <input style={input} type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <input style={input} type="password" placeholder="Senha" value={password}
            onChange={(e) => setPassword(e.target.value)} required />

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 10,
              padding: '10px 14px', marginBottom: 12, color: '#f87171', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: '#fff', fontSize: 15, fontWeight: 600,
            cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, marginBottom: 16,
          }}>
            {loading ? 'Aguarde...' : mode === 'signin' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          {mode === 'signin' ? 'Não tem conta? ' : 'Já tem conta? '}
          <span
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            style={{ color: '#a5b4fc', cursor: 'pointer', fontWeight: 500 }}
          >
            {mode === 'signin' ? 'Criar conta' : 'Entrar'}
          </span>
        </p>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AppProvider>
      <AuthGate />
    </AppProvider>
  )
}
