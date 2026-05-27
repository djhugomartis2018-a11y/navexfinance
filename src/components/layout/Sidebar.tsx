import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils/formatters'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'transactions', label: 'Transações', icon: '↕' },
  { id: 'goals', label: 'Metas', icon: '🎯' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'profile', label: 'Perfil', icon: '👤' },
  { id: 'settings', label: 'Configurações', icon: '⚙' },
]

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ currentPage, onNavigate, collapsed, onToggle }: SidebarProps) {
  const { profile, user, signOut } = useAuth()
  const displayName = profile?.full_name ?? user?.email ?? 'Usuário'

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        transition: 'width 0.2s ease',
        background: 'var(--sidebar-bg, #0f1117)',
        borderRight: '1px solid var(--border-color, rgba(255,255,255,0.08))',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 0',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: 16, color: '#fff', flexShrink: 0,
        }}>N</div>
        {!collapsed && (
          <span style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.3px' }}>
            NAVEX
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0 8px' }}>
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: 12, padding: '10px 12px', borderRadius: 10,
                border: 'none', cursor: 'pointer', marginBottom: 4,
                background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: active ? '#a5b4fc' : 'rgba(255,255,255,0.55)',
                fontSize: 14, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s ease',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '16px 8px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {!collapsed && (
          <div style={{ padding: '8px 12px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0,
            }}>
              {getInitials(displayName)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#fff',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          style={{
            width: '100%', padding: '8px 12px', borderRadius: 8,
            border: 'none', cursor: 'pointer', background: 'transparent',
            color: 'rgba(255,255,255,0.4)', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <span>⎋</span>
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}
