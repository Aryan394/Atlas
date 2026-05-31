import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, TrendingDown } from 'lucide-react'
import { getMonthlySpending } from '../api/transactions'
import type { MonthlySpending } from '../types/api'
import { formatCurrency, monthLabel } from '../utils/format'
import Card from './Card'

export default function MonthlySpendingCard() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [data, setData] = useState<MonthlySpending | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getMonthlySpending(year, month)
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [year, month])

  function shiftMonth(delta: number) {
    const date = new Date(year, month - 1 + delta, 1)
    setYear(date.getFullYear())
    setMonth(date.getMonth() + 1)
  }

  return (
    <Card className="animate-fade-in overflow-hidden">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
            <TrendingDown size={20} />
          </div>
          <p className="text-sm font-medium text-slate-400">Monthly spending</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">
            {loading ? (
              <span className="inline-block h-9 w-32 rounded-lg skeleton" />
            ) : (
              formatCurrency(data?.totalSpent ?? 0)
            )}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {loading ? (
              <span className="inline-block h-4 w-40 rounded skeleton" />
            ) : (
              `${data?.transactionCount ?? 0} expense${data?.transactionCount === 1 ? '' : 's'}`
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-[var(--color-border)] hover:text-white"
            aria-label="Previous month"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-[120px] text-center text-sm font-medium text-slate-200">
            {monthLabel(year, month)}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-[var(--color-border)] hover:text-white"
            aria-label="Next month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Card>
  )
}
