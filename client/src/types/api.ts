export interface ApiResponse<T> {
  message: string
  results?: T
  statusCode: number
  success: boolean
}

export interface ApiValidationErrors {
  [key: string]: string[] | undefined
}

export interface ApiErrorPayload {
  message?: string | string[]
  error?: string
  errors?: ApiValidationErrors
  statusCode?: number
}

export interface PaginationResult<T> {
  items: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  pageSize: number
}
