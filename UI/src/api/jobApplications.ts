import { apiRequest } from './client'
import type {
  CreateJobApplicationPayload,
  JobApplication,
  PaginatedJobApplications,
  UpdateJobApplicationPayload,
  UpdateJobApplicationStatusPayload,
} from '../types/api'

export interface GetJobApplicationsParams {
  page?: number
  pageSize?: number
  companyName?: string
}

export async function getJobApplications(params: GetJobApplicationsParams = {}) {
  const search = new URLSearchParams()
  if (params.page) search.set('page', String(params.page))
  if (params.pageSize) search.set('pageSize', String(params.pageSize))
  if (params.companyName?.trim()) search.set('companyName', params.companyName.trim())

  const query = search.toString()
  return apiRequest<PaginatedJobApplications>(
    `/api/job-applications/get-all${query ? `?${query}` : ''}`,
  )
}

export async function createJobApplication(payload: CreateJobApplicationPayload) {
  return apiRequest<JobApplication>('/api/job-applications/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateJobApplication(
  id: number,
  payload: UpdateJobApplicationPayload,
) {
  return apiRequest<JobApplication>(`/api/job-applications/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function updateJobApplicationStatus(
  id: number,
  payload: UpdateJobApplicationStatusPayload,
) {
  return apiRequest<JobApplication>(`/api/job-applications/update-status/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteJobApplication(id: number) {
  return apiRequest<void>(`/api/job-applications/delete/${id}`, {
    method: 'DELETE',
  })
}
