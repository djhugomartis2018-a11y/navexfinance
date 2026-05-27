import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { QuickAddFAB } from '../common/QuickAddFAB'

interface AppShellProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: string) => void
}

export function AppShell({ children, currentPage, onNavigate }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar onMenuToggle={() => setSidebarCollapsed((v) => !v)} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </main>
      </div>
      <QuickAddFAB onNavigate={onNavigate} />
    </div>
  )
}
