import axios from 'axios'
import type { ApiErrorPayload } from '@/types/api'

export class ApiError extends Error {
  statusCode?: number
  fieldErrors?: Record<string, string[] | undefined>

  constructor(message: string, statusCode?: number, fieldErrors?: Record<string, string[] | undefined>) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.fieldErrors = fieldErrors
  }
}

export function normalizeApiError(error: unknown) {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const payload = error.response?.data
    const message = Array.isArray(payload?.message)
      ? payload.message.join(', ')
      : payload?.message || payload?.error || error.message || 'Request failed.'

    return new ApiError(message, payload?.statusCode ?? error.response?.status, payload?.errors)
  }

  if (error instanceof Error) {
    return new ApiError(error.message)
  }

  return new ApiError('Something went wrong.')
}
