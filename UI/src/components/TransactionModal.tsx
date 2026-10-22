import { useState } from 'react'
import { X } from 'lucide-react'
import type { Transaction, TransactionType } from '../types/api'
import { todayIsoDate } from '../utils/format'
import Button from './Button'
import Input from './Input'

interface TransactionModalProps {
  transaction: Transaction | null
  onClose: () => void
  onSave: (payload: {
    description: string
    amount: number
    type: TransactionType
    date: string
    category?: string
  }) => Promise<void>
}

export default function TransactionModal({
  transaction,
  onClose,
  onSave,
}: TransactionModalProps) {
  const [description, setDescription] = useState(transaction?.description ?? '')
  const [amount, setAmount] = useState(
    transaction ? String(Math.abs(transaction.amount)) : '',
  )
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'Expense')
  const [date, setDate] = useState(transaction?.date ?? todayIsoDate())
  const [category, setCategory] = useState(transaction?.category ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const parsed = parseFloat(amount)
    if (!description.trim() || Number.isNaN(parsed) || parsed <= 0 || !date) {
      setError('Please fill in all required fields with valid values.')
      return
    }

    setLoading(true)
    try {
      await onSave({
        description: description.trim(),
        amount: Math.abs(parsed),
        type,
        date,
        category: category.trim() || undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md animate-fade-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {transaction ? 'Edit transaction' : 'New transaction'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-[var(--color-surface-muted)] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Grocery shopping"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <Input
              label="Amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <Input
            label="Category (optional)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Food, Transport..."
          />

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={loading}>
              {transaction ? 'Save changes' : 'Add transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
