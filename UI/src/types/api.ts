export interface ApiError {
  success: false
  message: string
}

export interface LoginResponse {
  token: string
  expiresAt: string
}

export interface UserResponse {
  id: number
  email: string
  createdAt: string
}

export type TransactionType = 'Income' | 'Expense' | 'Other'

export interface Transaction {
  id: number
  description: string
  amount: number
  type: TransactionType
  date: string
  category?: string | null
  creationTime: string
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
  type: TransactionType
  date: string
  category?: string
}

export type UpdateTransactionPayload = CreateTransactionPayload

export type ApplicationStatus =
  | 'Applied'
  | 'Rejected'
  | 'InProgress'
  | 'ShortlistedForInterview'

export interface JobApplication {
  id: number
  companyName: string
  jobUrl: string
  status: ApplicationStatus
  roundNumber?: number | null
  totalRounds?: number | null
  creationTime: string
}

export interface PaginatedJobApplications {
  items: JobApplication[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface CreateJobApplicationPayload {
  companyName: string
  jobUrl: string
  status: ApplicationStatus
  roundNumber?: number
  totalRounds?: number
}

export type UpdateJobApplicationPayload = CreateJobApplicationPayload

export interface UpdateJobApplicationStatusPayload {
  status: ApplicationStatus
  roundNumber?: number
  totalRounds?: number
}

export interface TodoItem {
  id: number
  title: string
  notes?: string | null
  isCompleted: boolean
  endTime?: string | null
  completionTime?: string | null
  creationTime: string
}

export interface PaginatedTodoItems {
  items: TodoItem[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface CreateTodoItemPayload {
  title: string
  notes?: string
  endTime?: string
}

export interface UpdateTodoItemPayload {
  title: string
  notes?: string
  endTime?: string | null
  isCompleted: boolean
}
