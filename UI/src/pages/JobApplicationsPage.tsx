import { useEffect, useState } from 'react'
import { Briefcase, ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import {
  createJobApplication,
  deleteJobApplication,
  getJobApplications,
  updateJobApplication,
  updateJobApplicationStatus,
} from '../api/jobApplications'
import type { ApplicationStatus, JobApplication } from '../types/api'
import { formatDateTime } from '../utils/format'
import Button from '../components/Button'
import Card from '../components/Card'
import ConfirmDialog from '../components/ConfirmDialog'
import JobApplicationModal from '../components/JobApplicationModal'

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'Applied', label: 'Applied' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'InProgress', label: 'InProgress' },
  { value: 'ShortlistedForInterview', label: 'Shortlisted for interview' },
]

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Applied: 'bg-cyan-500/15 text-cyan-300',
  Rejected: 'bg-red-500/15 text-red-300',
  InProgress: 'bg-amber-500/15 text-amber-300',
  ShortlistedForInterview: 'bg-emerald-500/15 text-emerald-300',
}

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [companySearchInput, setCompanySearchInput] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<JobApplication | null>(null)
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1)
      setCompanyName(companySearchInput.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [companySearchInput])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getJobApplications({
      page,
      pageSize: 20,
      companyName: companyName || undefined,
    })
      .then((result) => {
        if (!cancelled) {
          setApplications(result.items)
          setTotalPages(result.totalPages)
          setTotalCount(result.totalCount)
        }
      })
      .catch(() => {
        if (!cancelled) setApplications([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [page, companyName, refreshKey])

  function refresh() {
    setRefreshKey((k) => k + 1)
  }

  async function confirmDelete() {
    if (!pendingDelete?.id) return
    setDeleting(true)
    try {
      await deleteJobApplication(pendingDelete.id)
      setPendingDelete(null)
      refresh()
      if (applications.length === 1 && page > 1) {
        setPage((p) => p - 1)
      }
    } finally {
      setDeleting(false)
    }
  }

  async function handleStatusChange(app: JobApplication, status: ApplicationStatus) {
    if (!app.id || status === app.status) return

    if (status === 'ShortlistedForInterview' && (app.roundNumber == null || app.totalRounds == null)) {
      setEditing({ ...app, status })
      setModalOpen(true)
      return
    }

    setUpdatingStatusId(app.id)
    try {
      await updateJobApplicationStatus(app.id, {
        status,
        ...(status === 'ShortlistedForInterview'
          ? {
              roundNumber: app.roundNumber ?? undefined,
              totalRounds: app.totalRounds ?? undefined,
            }
          : {}),
      })
      refresh()
    } finally {
      setUpdatingStatusId(null)
    }
  }

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(application: JobApplication) {
    setEditing(application)
    setModalOpen(true)
  }

  async function handleSave(payload: {
    companyName: string
    jobUrl: string
    status: ApplicationStatus
    roundNumber?: number
    totalRounds?: number
  }) {
    if (editing) {
      await updateJobApplication(editing.id, payload)
    } else {
      await createJobApplication(payload)
    }
    setModalOpen(false)
    setEditing(null)
    refresh()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Job Applications
        </h1>
        <p className="mt-1 text-slate-400">
          Track companies you have applied to and interview progress
        </p>
      </div>

      <Card className="animate-fade-in">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <Briefcase size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Applications</h2>
              <p className="mt-1 text-sm text-slate-400">
                {totalCount} total · page {page} of {Math.max(totalPages, 1)}
              </p>
            </div>
          </div>
          <Button onClick={openCreate}>
            <Plus size={16} />
            Add application
          </Button>
        </div>

        <div className="mb-6">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-300">Search by company</span>
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="search"
                value={companySearchInput}
                onChange={(e) => setCompanySearchInput(e.target.value)}
                placeholder="Company name..."
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 sm:max-w-sm"
              />
            </div>
          </label>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-[var(--color-surface-muted)] text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Job URL</th>
                <th className="px-4 py-3 font-medium">Date applied</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Rounds</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-[var(--color-border)]">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-5 w-full rounded skeleton" />
                    </td>
                  </tr>
                ))
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                    {companyName
                      ? `No applications found for "${companyName}"`
                      : 'No job applications yet'}
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t border-[var(--color-border)] transition-colors hover:bg-[var(--color-surface-muted)]/50"
                  >
                    <td className="px-4 py-3 font-medium text-white">{app.companyName}</td>
                    <td className="px-4 py-3">
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-[240px] items-center gap-1 truncate text-cyan-400 hover:text-cyan-300"
                        title={app.jobUrl}
                      >
                        <span className="truncate">{app.jobUrl}</span>
                        <ExternalLink size={13} className="shrink-0" />
                      </a>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-300">
                      {formatDateTime(app.creationTime)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={app.status}
                        disabled={updatingStatusId === app.id}
                        onChange={(e) =>
                          handleStatusChange(app, e.target.value as ApplicationStatus)
                        }
                        className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-1.5 text-xs font-medium outline-none focus:border-emerald-500/50 disabled:opacity-50 ${STATUS_STYLES[app.status]}`}
                        aria-label="Update status"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {app.status === 'ShortlistedForInterview' &&
                      app.roundNumber != null &&
                      app.totalRounds != null
                        ? `${app.roundNumber} / ${app.totalRounds}`
                        : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(app)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-[var(--color-border)] hover:text-white"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(app)}
                          disabled={!app.id}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-400 disabled:opacity-50"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
        <JobApplicationModal
          jobApplication={editing}
          onClose={() => {
            setModalOpen(false)
            setEditing(null)
          }}
          onSave={handleSave}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete application"
          message={`Delete the application for ${pendingDelete.companyName}? This cannot be undone.`}
          loading={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
