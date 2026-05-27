import React from 'react'
import { formatMonthYear } from '../../utils/date'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const currentMonth = formatMonthYear(new Date())

  return (
    <header style={{
      height: 64, display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
      borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.08))',
      background: 'var(--bg-secondary, #0f1117)',
      flexShrink: 0,
    }}>
      <button
        onClick={onMenuToggle}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.5)', fontSize: 20, padding: 4 }}
        aria-label="Alternar menu"
      >
        ☰
      </button>
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>
        {currentMonth}
      </span>
    </header>
  )
}
