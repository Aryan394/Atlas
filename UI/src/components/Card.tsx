import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 p-6 shadow-xl shadow-black/20 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}
