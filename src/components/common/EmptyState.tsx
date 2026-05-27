import React from 'react'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 24px', textAlign: 'center',
    }}>
      <div style={{
        fontSize: 48, marginBottom: 16, opacity: 0.6,
        filter: 'grayscale(20%)',
      }}>{icon}</div>
      <h3 style={{
        margin: '0 0 8px', fontSize: 18, fontWeight: 600,
        color: 'rgba(255,255,255,0.85)',
      }}>{title}</h3>
      {description && (
        <p style={{
          margin: '0 0 24px', fontSize: 14, color: 'rgba(255,255,255,0.4)',
          maxWidth: 300, lineHeight: 1.6,
        }}>{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: '10px 24px', borderRadius: 50,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: '#fff', fontSize: 14,
            fontWeight: 500, cursor: 'pointer',
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
