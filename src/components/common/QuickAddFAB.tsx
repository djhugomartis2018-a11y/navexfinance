import React, { useState } from 'react'

interface QuickAddFABProps {
  onNavigate: (page: string) => void
}

const ACTIONS = [
  { label: 'Nova despesa', icon: '➖', page: 'transactions', type: 'expense' },
  { label: 'Nova receita', icon: '➕', page: 'transactions', type: 'income' },
  { label: 'Nova meta', icon: '🎯', page: 'goals' },
]

export function QuickAddFAB({ onNavigate }: QuickAddFABProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 100 }}>
      {/* Action items */}
      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                onNavigate(action.page)
                setOpen(false)
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', borderRadius: 50,
                background: '#1e1f2e', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ação rápida"
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, color: '#fff',
          boxShadow: '0 4px 24px rgba(99,102,241,0.4)',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'all 0.2s ease',
        }}
      >
        +
      </button>
    </div>
  )
}
