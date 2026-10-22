import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, CheckSquare, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ModuleCard {
  to: string
  title: string
  description: string
  icon: LucideIcon
  accent: string
  iconBg: string
}

const modules: ModuleCard[] = [
  {
    to: '/expense-tracker',
    title: 'Expense Tracker',
    description: 'Track spending, transactions, and monthly budgets',
    icon: Wallet,
    accent: 'group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    to: '/job-applications',
    title: 'Job Applications',
    description: 'Manage applications, interviews, and hiring progress',
    icon: Briefcase,
    accent: 'group-hover:border-cyan-500/40 group-hover:bg-cyan-500/5',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
  },
  {
    to: '/todos',
    title: 'To-Do List',
    description: 'Capture tasks, notes, and mark items complete',
    icon: CheckSquare,
    accent: 'group-hover:border-amber-500/40 group-hover:bg-amber-500/5',
    iconBg: 'bg-amber-500/15 text-amber-400',
  },
]

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Modules
        </h1>
        <p className="mt-1 text-slate-400">
          Choose a workspace to get started
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link
              key={module.to}
              to={module.to}
              className={`group animate-fade-in rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/90 p-6 shadow-xl shadow-black/20 backdrop-blur-sm transition-all ${module.accent}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${module.iconBg}`}
                >
                  <Icon size={22} />
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-slate-300"
                />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-white">{module.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {module.description}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
