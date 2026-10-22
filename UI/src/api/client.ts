import type { ApiError } from '../types/api'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5236'

const TOKEN_KEY = 'atlas_token'
const EXPIRES_KEY = 'atlas_expires'

export function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const expires = localStorage.getItem(EXPIRES_KEY)
  if (!token || !expires) return null
  if (new Date(expires) <= new Date()) {
    clearStoredToken()
    return null
  }
  return token
}

export function setStoredToken(token: string, expiresAt: string) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EXPIRES_KEY, expiresAt)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRES_KEY)
}

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')

  if (auth) {
    const token = getStoredToken()
    if (!token) {
      throw new ApiRequestError('Not authenticated', 401)
    }
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data
        ? (data as ApiError).message
        : 'Request failed'
    throw new ApiRequestError(message, response.status)
  }

  return data as T
}
