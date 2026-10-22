import { useState } from 'react'
import { X } from 'lucide-react'
import type { ApplicationStatus, JobApplication } from '../types/api'
import Button from './Button'
import Input from './Input'

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'Applied', label: 'Applied' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'InProgress', label: 'InProgress' },
  { value: 'ShortlistedForInterview', label: 'Shortlisted for interview' },
]

interface JobApplicationModalProps {
  jobApplication: JobApplication | null
  onClose: () => void
  onSave: (payload: {
    companyName: string
    jobUrl: string
    status: ApplicationStatus
    roundNumber?: number
    totalRounds?: number
  }) => Promise<void>
}

export default function JobApplicationModal({
  jobApplication,
  onClose,
  onSave,
}: JobApplicationModalProps) {
  const [companyName, setCompanyName] = useState(jobApplication?.companyName ?? '')
  const [jobUrl, setJobUrl] = useState(jobApplication?.jobUrl ?? '')
  const [status, setStatus] = useState<ApplicationStatus>(
    jobApplication?.status ?? 'Applied',
  )
  const [roundNumber, setRoundNumber] = useState(
    jobApplication?.roundNumber != null ? String(jobApplication.roundNumber) : '',
  )
  const [totalRounds, setTotalRounds] = useState(
    jobApplication?.totalRounds != null ? String(jobApplication.totalRounds) : '',
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const showRoundFields = status === 'ShortlistedForInterview'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!companyName.trim() || !jobUrl.trim()) {
      setError('Please fill in company name and job URL.')
      return
    }

    let parsedRound: number | undefined
    let parsedTotal: number | undefined

    if (showRoundFields) {
      parsedRound = parseInt(roundNumber, 10)
      parsedTotal = parseInt(totalRounds, 10)

      if (
        Number.isNaN(parsedRound) ||
        Number.isNaN(parsedTotal) ||
        parsedRound < 1 ||
        parsedTotal < 1
      ) {
        setError('Round number and total rounds must be positive integers.')
        return
      }

      if (parsedRound > parsedTotal) {
        setError('Round number cannot be greater than total rounds.')
        return
      }
    }

    setLoading(true)
    try {
      await onSave({
        companyName: companyName.trim(),
        jobUrl: jobUrl.trim(),
        status,
        ...(showRoundFields
          ? { roundNumber: parsedRound, totalRounds: parsedTotal }
          : {}),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save job application')
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
            {jobApplication ? 'Edit job application' : 'New job application'}
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
            label="Company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Corp"
            required
          />

          <Input
            label="Job URL"
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            placeholder="https://careers.example.com/role"
            required
          />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Application status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2.5 text-sm text-white outline-none focus:border-emerald-500/50"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {showRoundFields && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Round number"
                type="number"
                min="1"
                step="1"
                value={roundNumber}
                onChange={(e) => setRoundNumber(e.target.value)}
                placeholder="1"
                required
              />
              <Input
                label="Total rounds"
                type="number"
                min="1"
                step="1"
                value={totalRounds}
                onChange={(e) => setTotalRounds(e.target.value)}
                placeholder="3"
                required
              />
            </div>
          )}

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
              {jobApplication ? 'Save changes' : 'Add application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
