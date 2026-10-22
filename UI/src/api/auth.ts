import { apiRequest } from './client'
import type { LoginResponse, UserResponse } from '../types/api'

export async function login(email: string, password: string) {
  return apiRequest<LoginResponse>(
    '/api/account/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
    false,
  )
}

export async function register(email: string, password: string) {
  return apiRequest<UserResponse>('/api/account/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
