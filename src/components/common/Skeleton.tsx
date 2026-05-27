import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: number
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  return (
    <div
      style={{
        width, height, borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style,
      }}
    />
  )
}

export function CardSkeleton() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', borderRadius: 16,
      padding: 20, border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <Skeleton height={12} width="40%" style={{ marginBottom: 12 }} />
      <Skeleton height={28} width="60%" style={{ marginBottom: 8 }} />
      <Skeleton height={10} width="30%" />
    </div>
  )
}

export function TransactionRowSkeleton() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <Skeleton width={40} height={40} borderRadius={50} />
      <div style={{ flex: 1 }}>
        <Skeleton height={13} width="50%" style={{ marginBottom: 6 }} />
        <Skeleton height={11} width="30%" />
      </div>
      <Skeleton height={16} width={80} />
    </div>
  )
}
