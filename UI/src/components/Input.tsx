import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={inputId} className="block space-y-2">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 ${className}`}
        {...props}
      />
    </label>
  )
}
