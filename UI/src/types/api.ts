export interface ApiError {
  success: false
  message: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
}

export interface UserResponse {
  id: string
  email: string
  createdAt: string
}

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  category?: string | null
}

export interface PaginatedTransactions {
  items: Transaction[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface MonthlySpending {
  year: number
  month: number
  startDate: string
  endDate: string
  totalSpent: number
  transactionCount: number
}

export interface CreateTransactionPayload {
  description: string
  amount: number
  date: string
  category?: string
}

export type UpdateTransactionPayload = CreateTransactionPayload
