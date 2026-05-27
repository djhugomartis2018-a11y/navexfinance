import React, { useState } from 'react'
import { useProfile } from '../../hooks/useProfile'
import { getInitials } from '../../utils/formatters'

export default function ProfilePage() {
  const { profile, user, updateProfile } = useProfile()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? '',
    username: profile?.username ?? '',
    website: profile?.website ?? '',
  })

  const displayName = profile?.full_name ?? user?.email ?? 'Usuário'

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await updateProfile(form)
      setSuccess(true)
      setEditing(false)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 28px', fontSize: 26, fontWeight: 700, color: '#fff' }}>Perfil</h1>

      {/* Avatar section */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 28, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
          {getInitials(displayName)}
        </div>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 600, color: '#fff' }}>{displayName}</p>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>{user?.email}</p>
        </div>
      </div>

      {/* Info form */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#fff' }}>Informações pessoais</h2>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 13, cursor: 'pointer' }}>
              Editar
            </button>
          )}
        </div>

        {success && (
          <div style={{ background: 'rgba(34,197,94,0.1)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#4ade80', fontSize: 13 }}>
            ✓ Perfil atualizado com sucesso!
          </div>
        )}

        <form onSubmit={handleSave}>
          {[
            { label: 'Nome completo', key: 'full_name', placeholder: 'Seu nome' },
            { label: 'Username', key: 'username', placeholder: '@usuario' },
            { label: 'Website', key: 'website', placeholder: 'https://...' },
          ].map(({ label, key, placeholder }) => (
            <div key={key} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
              {editing ? (
                <input style={inputStyle} value={form[key as keyof typeof form]} placeholder={placeholder}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
              ) : (
                <p style={{ margin: 0, fontSize: 14, color: form[key as keyof typeof form] ? '#fff' : 'rgba(255,255,255,0.25)', padding: '10px 0' }}>
                  {form[key as keyof typeof form] || '—'}
                </p>
              )}
            </div>
          ))}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
            <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.6)', padding: '10px 0' }}>{user?.email}</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>{error}</div>
          )}

          {editing && (
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: '11px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 14, cursor: 'pointer' }}>Cancelar</button>
              <button type="submit" disabled={loading} style={{ flex: 2, padding: '11px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
