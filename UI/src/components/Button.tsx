import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  loading?: boolean
}

const variants = {
  primary:
    'bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20',
  secondary:
    'bg-[var(--color-surface-muted)] text-slate-200 hover:bg-[var(--color-border)] border border-[var(--color-border)]',
  ghost: 'bg-transparent text-slate-300 hover:bg-[var(--color-surface-muted)]',
  danger: 'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/20',
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
