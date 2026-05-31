import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../api/transactions'
import type { Transaction } from '../types/api'
import { formatCurrency, formatDate } from '../utils/format'
import Button from './Button'
import Card from './Card'
import TransactionModal from './TransactionModal'

interface TransactionPanelProps {
  refreshKey: number
  onChanged: () => void
}

export default function TransactionPanel({
  refreshKey,
  onChanged,
}: TransactionPanelProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getTransactions({
      page,
      pageSize: 20,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((result) => {
        if (!cancelled) {
          setTransactions(result.items)
          setTotalPages(result.totalPages)
          setTotalCount(result.totalCount)
        }
      })
      .catch(() => {
        if (!cancelled) setTransactions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, startDate, endDate, refreshKey])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteTransaction(id)
      onChanged()
      if (transactions.length === 1 && page > 1) {
        setPage((p) => p - 1)
      }
    } finally {
      setDeletingId(null)
    }
  }

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(transaction: Transaction) {
    setEditing(transaction)
    setModalOpen(true)
  }

  async function handleSave(payload: {
    description: string
    amount: number
    date: string
    category?: string
  }) {
    if (editing) {
      await updateTransaction(editing.id, payload)
    } else {
      await createTransaction(payload)
    }
    setModalOpen(false)
    setEditing(null)
    onChanged()
  }

  return (
    <>
      <Card className="animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Transactions</h2>
            <p className="mt-1 text-sm text-slate-400">
              {totalCount} total · page {page} of {Math.max(totalPages, 1)}
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus size={16} />
            Add transaction
          </Button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">From</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setPage(1)
                setStartDate(e.target.value)
              }}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">To</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setPage(1)
                setEndDate(e.target.value)
              }}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
            />
          </label>
          {(startDate || endDate) && (
            <div className="flex items-end sm:col-span-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setStartDate('')
                  setEndDate('')
                  setPage(1)
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-[var(--color-surface-muted)] text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Description</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium text-right">Amount</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="h-5 w-full rounded skeleton" />
                    </td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isIncome = tx.amount >= 0
                  return (
                    <tr
                      key={tx.id}
                      className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-muted)]/50"
                    >
                      <td className="px-4 py-3 text-slate-300">{formatDate(tx.date)}</td>
                      <td className="px-4 py-3 font-medium text-white">{tx.description}</td>
                      <td className="px-4 py-3">
                        {tx.category ? (
                          <span className="rounded-full bg-[var(--color-surface-muted)] px-2.5 py-1 text-xs text-slate-300">
                            {tx.category}
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-semibold ${
                          isIncome ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {isIncome ? '+' : '−'}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(tx)}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-[var(--color-border)] hover:text-white"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(tx.id)}
                            disabled={deletingId === tx.id}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                            aria-label="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Card>

      {modalOpen && (
        <TransactionModal
          transaction={editing}
          onClose={() => {
            setModalOpen(false)
            setEditing(null)
          }}
          onSave={handleSave}
        />
      )}
    </>
  )
}
