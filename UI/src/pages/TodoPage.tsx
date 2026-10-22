import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, CheckSquare, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  deleteTodoItem,
  getTodoItems,
  markTodoCompleted,
} from '../api/todos'
import type { TodoItem } from '../types/api'
import { formatDateTime } from '../utils/format'
import Button from '../components/Button'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'

type Tab = 'all' | 'overdue'

export default function TodoPage() {
  const [tab, setTab] = useState<Tab>('all')
  const [items, setItems] = useState<TodoItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [pendingDelete, setPendingDelete] = useState<TodoItem | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [completingId, setCompletingId] = useState<number | null>(null)

  useEffect(() => {
    setPage(1)
  }, [tab])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getTodoItems({
      page,
      pageSize: 50,
      overdueOnly: tab === 'overdue',
    })
      .then((result) => {
        if (!cancelled) {
          setItems(result.items)
          setTotalPages(result.totalPages)
          setTotalCount(result.totalCount)
        }
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, tab, refreshKey])

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  async function handleComplete(item: TodoItem) {
    if (!item.id || item.isCompleted) return
    setCompletingId(item.id)
    try {
      await markTodoCompleted(item.id)
      refresh()
    } finally {
      setCompletingId(null)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete?.id) return
    setDeleting(true)
    try {
      await deleteTodoItem(pendingDelete.id)
      setPendingDelete(null)
      refresh()
      if (items.length === 1 && page > 1) {
        setPage((p) => p - 1)
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            To-Do List
          </h1>
          <p className="mt-1 text-slate-400">
            Keep track of tasks and mark them done as you go
          </p>
        </div>
        <Link to="/todos/new">
          <Button>
            <Plus size={16} />
            Add task
          </Button>
        </Link>
      </div>

      <Card className="animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
              <CheckSquare size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Tasks</h2>
              <p className="mt-1 text-sm text-slate-400">
                {totalCount} total · page {page} of {Math.max(totalPages, 1)}
              </p>
            </div>
          </div>

          <div className="flex rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-1">
            <button
              type="button"
              onClick={() => setTab('all')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === 'all'
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTab('overdue')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === 'overdue'
                  ? 'bg-red-500/15 text-red-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tasks Overdue
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl skeleton" />
            ))
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              {tab === 'overdue' ? 'No overdue tasks' : 'No tasks yet'}
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]/40 px-4 py-3 transition-colors hover:bg-[var(--color-surface-muted)]/70"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`font-medium ${
                      item.isCompleted ? 'text-slate-500 line-through' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </p>
                  {item.notes && (
                    <p className="mt-1 text-sm text-slate-400">{item.notes}</p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>Created {formatDateTime(item.creationTime)}</span>
                    {item.endTime && (
                      <span className={tab === 'overdue' ? 'text-red-400' : undefined}>
                        Due {formatDateTime(item.endTime)}
                      </span>
                    )}
                    {item.isCompleted && item.completionTime && (
                      <span className="text-emerald-400">
                        Completed {formatDateTime(item.completionTime)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-1">
                  {!item.isCompleted && (
                    <button
                      type="button"
                      onClick={() => handleComplete(item)}
                      disabled={completingId === item.id}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-emerald-500/15 hover:text-emerald-400 disabled:opacity-50"
                      aria-label="Mark completed"
                      title="Mark completed"
                    >
                      <Check size={15} />
                    </button>
                  )}
                  <Link
                    to={`/todos/${item.id}/edit`}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-[var(--color-border)] hover:text-white"
                    aria-label="Edit"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(item)}
                    disabled={!item.id}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
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

      {pendingDelete && (
        <ConfirmDialog
          title="Delete task"
          message={`Delete "${pendingDelete.title}"? This cannot be undone.`}
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
