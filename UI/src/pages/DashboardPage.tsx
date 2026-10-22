import { useState } from 'react'
import MonthlySpendingCard from '../components/MonthlySpendingCard'
import TransactionPanel from '../components/TransactionPanel'

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Expense Tracker
        </h1>
        <p className="mt-1 text-slate-400">
          Overview of your spending and recent activity
        </p>
      </div>

      <MonthlySpendingCard />

      <TransactionPanel
        refreshKey={refreshKey}
        onChanged={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  )
}
