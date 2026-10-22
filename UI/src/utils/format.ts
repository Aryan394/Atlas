const IST = 'Asia/Kolkata'

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Math.abs(amount))
}

export function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: IST,
  })
}

/** Display a UTC ISO timestamp in IST. */
export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: IST,
  })
}

export function monthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
    timeZone: IST,
  })
}

export function todayIsoDate() {
  return new Date().toLocaleDateString('en-CA', { timeZone: IST })
}

/** End of an IST calendar day (23:59:59.999 IST) as UTC ISO string. */
export function istEndOfDayToUtcIso(dayOffset = 0): string {
  const istDate = todayIsoDate()
  const [y, m, d] = istDate.split('-').map(Number)
  const base = new Date(Date.UTC(y, m - 1, d + dayOffset, 18, 29, 59, 999))
  // 23:59:59.999 IST = 18:29:59.999 UTC (IST is UTC+5:30)
  return base.toISOString()
}

/**
 * Treat a datetime-local value (YYYY-MM-DDTHH:mm) as IST and convert to UTC ISO.
 */
export function istLocalInputToUtcIso(localValue: string): string {
  const match = localValue.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/,
  )
  if (!match) {
    throw new Error('Invalid datetime')
  }

  const [, ys, ms, ds, hs, mins, ss] = match
  const year = Number(ys)
  const month = Number(ms)
  const day = Number(ds)
  const hour = Number(hs)
  const minute = Number(mins)
  const second = Number(ss ?? 0)

  // IST = UTC+5:30 → UTC = IST - 5:30
  const utcMillis = Date.UTC(year, month - 1, day, hour, minute, second) - (5 * 60 + 30) * 60 * 1000
  return new Date(utcMillis).toISOString()
}

/** Convert a UTC ISO string to datetime-local value in IST (YYYY-MM-DDTHH:mm). */
export function utcIsoToIstLocalInput(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: IST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso))

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00'
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`
}
