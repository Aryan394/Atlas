import { apiRequest } from './client'
import type {
  CreateTransactionPayload,
  MonthlySpending,
  PaginatedTransactions,
  Transaction,
  UpdateTransactionPayload,
} from '../types/api'

export interface GetTransactionsParams {
  page?: number
  pageSize?: number
  startDate?: string
  endDate?: string
}

export async function getTransactions(params: GetTransactionsParams = {}) {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.pageSize) search.set('pageSize', String(params.pageSize))
  if (params.startDate) search.set('startDate', params.startDate)
  if (params.endDate) search.set('endDate', params.endDate)

  const query = search.toString()
  return apiRequest<PaginatedTransactions>(
    `/api/transactions/get-all${query ? `?${query}` : ''}`,
  )
}

export async function getMonthlySpending(year?: number, month?: number) {
  const search = new URLSearchParams()
  if (year) search.set('year', String(year))
  if (month) search.set('month', String(month))

  const query = search.toString()
  return apiRequest<MonthlySpending>(
    `/api/transactions/get-monthly-spending${query ? `?${query}` : ''}`,
  )
}

export async function createTransaction(payload: CreateTransactionPayload) {
  return apiRequest<Transaction>('/api/transactions/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateTransaction(
  id: number,
  payload: UpdateTransactionPayload,
) {
  return apiRequest<Transaction>(`/api/transactions/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteTransaction(id: number) {
  return apiRequest<void>(`/api/transactions/delete/${id}`, {
    method: 'DELETE',
  })
}
