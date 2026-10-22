import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckSquare } from 'lucide-react'
import { createTodoItem, getTodoItem, updateTodoItem } from '../api/todos'
import {
  istEndOfDayToUtcIso,
  istLocalInputToUtcIso,
  utcIsoToIstLocalInput,
} from '../utils/format'
import Button from '../components/Button'
import Card from '../components/Card'
import Input from '../components/Input'

type EndTimeMode = 'none' | 'today' | 'tomorrow' | 'custom'

export default function TodoFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editingId = id ? Number(id) : null
  const isEditing = editingId != null && !Number.isNaN(editingId)

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [endTimeMode, setEndTimeMode] = useState<EndTimeMode>('none')
  const [customEndTime, setCustomEndTime] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing || editingId == null) return

    let cancelled = false
    setLoading(true)

    getTodoItem(editingId)
      .then((item) => {
        if (cancelled) return
        setTitle(item.title)
        setNotes(item.notes ?? '')
        setIsCompleted(item.isCompleted)
        if (item.endTime) {
          setEndTimeMode('custom')
          setCustomEndTime(utcIsoToIstLocalInput(item.endTime))
        } else {
          setEndTimeMode('none')
          setCustomEndTime('')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load task')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [editingId, isEditing])

  function resolveEndTimeUtc(): string | undefined {
    if (endTimeMode === 'none') return undefined
    if (endTimeMode === 'today') return istEndOfDayToUtcIso(0)
    if (endTimeMode === 'tomorrow') return istEndOfDayToUtcIso(1)
    if (!customEndTime) {
      throw new Error('Please select a custom end date and time.')
    }
    return istLocalInputToUtcIso(customEndTime)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Please enter a title.')
      return
    }

    setSaving(true)
    try {
      const endTime = resolveEndTimeUtc()

      if (isEditing && editingId != null) {
        await updateTodoItem(editingId, {
          title: title.trim(),
          notes: notes.trim() || undefined,
          endTime: endTime ?? null,
          isCompleted,
        })
      } else {
        await createTodoItem({
          title: title.trim(),
          notes: notes.trim() || undefined,
          endTime,
        })
      }

      navigate('/todos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/todos"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to tasks
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {isEditing ? 'Edit task' : 'Add task'}
        </h1>
        <p className="mt-1 text-slate-400">
          Deadlines are chosen in IST and stored as UTC
        </p>
      </div>

      <Card className="animate-fade-in max-w-xl">
        {loading ? (
          <div className="space-y-3">
            <div className="h-10 rounded-xl skeleton" />
            <div className="h-24 rounded-xl skeleton" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <CheckSquare size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Task details</h2>
                <p className="mt-1 text-sm text-slate-400">Title, notes, and optional deadline</p>
              </div>
            </div>

            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Buy groceries"
              required
            />

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-300">Notes (optional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any extra details..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-slate-300">End time (optional, IST)</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ['none', 'No deadline'],
                    ['today', 'Today'],
                    ['tomorrow', 'Tomorrow'],
                    ['custom', 'Custom'],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                      endTimeMode === value
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-muted)] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="endTimeMode"
                      value={value}
                      checked={endTimeMode === value}
                      onChange={() => setEndTimeMode(value)}
                      className="accent-emerald-500"
                    />
                    {label}
                  </label>
                ))}
              </div>

              {endTimeMode === 'custom' && (
                <Input
                  label="Custom date & time (IST)"
                  type="datetime-local"
                  value={customEndTime}
                  onChange={(e) => setCustomEndTime(e.target.value)}
                  required
                />
              )}
            </fieldset>

            {error && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate('/todos')}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" loading={saving}>
                {isEditing ? 'Save changes' : 'Add task'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}
