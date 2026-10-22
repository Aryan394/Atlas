import { apiRequest } from './client'
import type {
  CreateTodoItemPayload,
  PaginatedTodoItems,
  TodoItem,
  UpdateTodoItemPayload,
} from '../types/api'

export interface GetTodoItemsParams {
  page?: number
  pageSize?: number
  overdueOnly?: boolean
}

export async function getTodoItems(params: GetTodoItemsParams = {}) {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.pageSize) search.set('pageSize', String(params.pageSize))
  if (params.overdueOnly) search.set('overdueOnly', 'true')

  const query = search.toString()
  return apiRequest<PaginatedTodoItems>(
    `/api/todos/get-all${query ? `?${query}` : ''}`,
  )
}

export async function getTodoItem(id: number) {
  return apiRequest<TodoItem>(`/api/todos/get-by-id/${id}`)
}

export async function createTodoItem(payload: CreateTodoItemPayload) {
  return apiRequest<TodoItem>('/api/todos/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateTodoItem(id: number, payload: UpdateTodoItemPayload) {
  return apiRequest<TodoItem>(`/api/todos/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function markTodoCompleted(id: number) {
  return apiRequest<TodoItem>(`/api/todos/mark-completed/${id}`, {
    method: 'PUT',
  })
}

export async function deleteTodoItem(id: number) {
  return apiRequest<void>(`/api/todos/delete/${id}`, {
    method: 'DELETE',
  })
}
