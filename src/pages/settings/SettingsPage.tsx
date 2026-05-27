import React from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function SettingsPage() {
  const { signOut } = useAuth()

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 24, marginBottom: 16 }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600, color: '#fff' }}>{title}</h2>
      {children}
    </div>
  )

  const Row = ({ label, description, action }: { label: string; description?: string; action?: React.ReactNode }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <p style={{ margin: '0 0 2px', fontSize: 14, color: '#fff' }}>{label}</p>
        {description && <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{description}</p>}
      </div>
      {action}
    </div>
  )

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 26, fontWeight: 700, color: '#fff' }}>Configurações</h1>

      <Section title="Conta">
        <Row label="Plano" description="Plano gratuito" action={
          <span style={{ fontSize: 12, padding: '4px 10px', borderRadius: 20, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>Free</span>
        } />
        <Row label="Moeda" description="Real Brasileiro (BRL)" action={
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>R$</span>
        } />
        <Row label="Idioma" description="Português (BR)" />
      </Section>

      <Section title="Notificações">
        <Row label="Alertas de limite de orçamento" description="Notifique quando atingir 80% do orçamento" action={
          <div style={{ width: 40, height: 22, borderRadius: 11, background: 'rgba(99,102,241,0.4)', position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', right: 2, top: 2, width: 18, height: 18, borderRadius: '50%', background: '#a5b4fc' }} />
          </div>
        } />
        <Row label="Lembrete mensal" description="Relatório financeiro no início de cada mês" action={
          <div style={{ width: 40, height: 22, borderRadius: 11, background: 'rgba(255,255,255,0.1)', position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', left: 2, top: 2, width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
          </div>
        } />
      </Section>

      <Section title="Dados">
        <Row label="Exportar dados" description="Baixe todas as suas transações em CSV" action={
          <button style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 12, cursor: 'pointer' }}>
            Exportar
          </button>
        } />
      </Section>

      <Section title="Sessão">
        <Row label="Sair da conta" description="Encerre sua sessão atual" action={
          <button onClick={signOut} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: 12, cursor: 'pointer' }}>
            Sair
          </button>
        } />
      </Section>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 32 }}>
        NAVEX Finance · v1.0.0 · Sprint 1
      </p>
    </div>
  )
}
